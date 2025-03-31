package service

import (
	"M-AI/api/dto"
	"M-AI/api/model"
	"M-AI/api/repository"
	"M-AI/api/requests"
	"M-AI/pkg/db"
	"gorm.io/gorm"
)

type QuizService struct {
	quizRepo *repository.QuizRepository
	db       *gorm.DB
}

func NewQuizService(db *gorm.DB, quizRepo *repository.QuizRepository) *QuizService {
	return &QuizService{quizRepo: quizRepo, db: db}
}

func (s *QuizService) CreateQuizWithQuestions(req requests.CreateQuizRequest) error {
	return db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		quiz := model.Quiz{
			Level: req.Level,
			Time:  req.Time,
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
			})
		}

		if err := s.quizRepo.BulkCreateQuestions(tx, questions); err != nil {
			return err
		}

		return nil
	})
}

func (s *QuizService) ListQuizzesWithUserStats(userID uint, search string) ([]dto.QuizWithStats, error) {
	var result []dto.QuizWithStats

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		stats, err := s.quizRepo.ListQuizzesWithUserStats(tx, userID, search)
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
