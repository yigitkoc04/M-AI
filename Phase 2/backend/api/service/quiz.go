package service

import (
	"M-AI/api/constants"
	"M-AI/api/dto"
	"M-AI/api/model"
	"M-AI/api/repository"
	"M-AI/api/requests"
	"M-AI/pkg/db"
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
	"math"
	"sort"
	"strings"
)

type QuizService struct {
	quizRepo     *repository.QuizRepository
	quizLogRepo  *repository.QuizLogRepository
	userLogRepo  *repository.UserLogRepository
	questionRepo *repository.QuestionRepository
	aiService    *OpenAIService
	db           *gorm.DB
}

func NewQuizService(
	db *gorm.DB,
	quizRepo *repository.QuizRepository,
	quizLogRepo *repository.QuizLogRepository,
	userLogRepo *repository.UserLogRepository,
	questionRepo *repository.QuestionRepository,
	aiService *OpenAIService,
) *QuizService {
	return &QuizService{
		quizRepo:     quizRepo,
		quizLogRepo:  quizLogRepo,
		userLogRepo:  userLogRepo,
		questionRepo: questionRepo,
		aiService:    aiService,
		db:           db,
	}
}

func (s *QuizService) CreateQuizWithQuestions(req requests.CreateQuizRequest) error {
	return db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		quiz := model.Quiz{
			Title:       req.Title,
			Description: req.Description,
			Level:       req.Level,
		}

		if err := s.quizRepo.CreateQuiz(tx, &quiz); err != nil {
			return err
		}

		var questions []model.Question
		for _, q := range req.Questions {
			questions = append(questions, model.Question{
				QuizID:   quiz.ID,
				Question: q.Question,
				Answer:   q.Answer,
				AnswerA:  q.AnswerA,
				AnswerB:  q.AnswerB,
				AnswerC:  q.AnswerC,
				AnswerD:  q.AnswerD,
				Topic:    q.Topic,
			})
		}

		if err := s.quizRepo.BulkCreateQuestions(tx, questions); err != nil {
			return err
		}

		return nil
	})
}

func (s *QuizService) ListQuizzesWithUserStats(userID uint, search string, filter string) ([]dto.QuizWithStats, error) {
	var result []dto.QuizWithStats

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		stats, err := s.quizRepo.ListQuizzesWithUserStats(tx, userID, search, filter)
		if err != nil {
			return err
		}
		result = stats
		return nil
	})

	if err != nil {
		return nil, InternalError("Failed to list quizzes", err)
	}

	return result, nil
}

func (s *QuizService) CompleteQuiz(submission dto.QuizSubmission) error {
	return db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		questions, err := s.questionRepo.GetByQuizID(tx, submission.QuizID)
		if err != nil {
			return err
		}

		var correctCount int
		var userLogs []model.UserLog

		for _, q := range questions {
			userAnswer, answered := submission.Answers[q.ID]
			isCorrect := false

			if answered {
				isCorrect = strings.EqualFold(userAnswer, q.Answer)
				if isCorrect {
					correctCount++
				}
			}

			userLogs = append(userLogs, model.UserLog{
				CorrectAnswer: isCorrect,
				UserID:        submission.UserID,
				QuestionID:    &q.ID,
				FromQuiz:      true,
			})
		}

		total := len(questions)
		score := 0
		if total > 0 {
			score = int(float64(correctCount) / float64(total) * 100)
		}

		err = s.quizLogRepo.Create(tx, &model.QuizLog{
			QuizID: submission.QuizID,
			UserID: submission.UserID,
			Score:  score,
		})
		if err != nil {
			return err
		}

		if len(userLogs) > 0 {
			err = s.userLogRepo.CreateBatch(tx, userLogs)
			if err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *QuizService) GenerateQuizFromPrompt(req dto.AIQuizRequest) (dto.QuizWithStats, error) {
	var q dto.QuizWithStats

	// Step 1: Handle PromptType "struggle-areas"
	if req.PromptType == "struggle-areas" {
		proficiency, err := s.quizRepo.GetTopicProficiency(s.db, req.UserID)
		if err != nil {
			return q, fmt.Errorf("failed to get topic proficiency: %w", err)
		}

		if len(proficiency) == 0 {
			return q, fmt.Errorf("no topic data found for user")
		}

		sort.Slice(proficiency, func(i, j int) bool {
			return proficiency[i].Score < proficiency[j].Score
		})

		// Step 1: Calculate total weakness weight
		var totalWeight float64
		weights := make(map[string]float64)

		for _, p := range proficiency {
			weight := 1 - p.Score // Lower score → higher weight
			if weight < 0 {
				weight = 0
			}
			weights[p.Topic] = weight
			totalWeight += weight
		}

		// Step 2: Assign proportional question counts
		typeCount := make(map[string]int)
		totalAssigned := 0

		for topic, weight := range weights {
			portion := int(math.Floor((weight / totalWeight) * 5))
			typeCount[topic] = portion
			totalAssigned += portion
		}

		// Step 3: If we haven't hit 5 total, assign leftovers starting from weakest
		if totalAssigned < 5 {
			// Sort topics by descending weight
			sorted := make([]struct {
				Topic  string
				Weight float64
			}, 0, len(weights))

			for topic, weight := range weights {
				sorted = append(sorted, struct {
					Topic  string
					Weight float64
				}{topic, weight})
			}

			sort.Slice(sorted, func(i, j int) bool {
				return sorted[i].Weight > sorted[j].Weight
			})

			for i := 0; totalAssigned < 5 && i < len(sorted); i++ {
				typeCount[sorted[i].Topic]++
				totalAssigned++
			}
		}

		var parts []string
		for topic, count := range typeCount {
			if count > 0 {
				parts = append(parts, fmt.Sprintf("%d question(s) on %s", count, topic))
			}
		}
		req.Prompt = fmt.Sprintf(
			"Generate a GCSE-level math quiz with %s. Each question should match the difficulty: %s.",
			strings.Join(parts, ", "),
			req.Level,
		)
		fmt.Println(req.Prompt)
	}

	responseStr, err := s.aiService.SendPrompt(req.Prompt)
	if err != nil {
		fmt.Println(err)
		return q, fmt.Errorf("failed to get response from AI: %w", err)
	}

	fmt.Println(responseStr)

	var quizData dto.AIQuizResponse
	if err = json.Unmarshal([]byte(responseStr), &quizData); err != nil {
		return q, fmt.Errorf("failed to parse AI response: %w", err)
	}

	err = db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		quiz := model.Quiz{
			Title:       req.Title,
			Description: req.Description,
			Level:       req.Level,
		}

		if err := tx.Create(&quiz).Error; err != nil {
			return err
		}

		var questions []model.Question
		for _, q := range quizData.Questions {
			questions = append(questions, model.Question{
				QuizID:   quiz.ID,
				Question: q.Question,
				Answer:   q.Answer,
				AnswerA:  q.AnswerA,
				AnswerB:  q.AnswerB,
				AnswerC:  q.AnswerC,
				AnswerD:  q.AnswerD,
				Topic:    constants.TopicEnum(q.Topic),
			})
		}

		if err := tx.Create(&questions).Error; err != nil {
			return err
		}

		q, err = s.quizRepo.GetQuizByIDWithStats(tx, req.UserID, quiz.ID)
		return err
	})

	if err != nil {
		return q, fmt.Errorf("failed to create quiz and questions: %w", err)
	}

	return q, nil
}
