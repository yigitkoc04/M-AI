package repository

import (
	"M-AI/api/dto"
	"M-AI/api/model"
	"gorm.io/gorm"
)

type QuizRepository struct{}

func (r *QuizRepository) CreateQuiz(tx *gorm.DB, quiz *model.Quiz) error {
	return tx.Create(quiz).Error
}

func (r *QuizRepository) BulkCreateQuestions(tx *gorm.DB, questions []model.Question) error {
	return tx.Create(&questions).Error
}

func (r *QuizRepository) ListQuizzesWithUserStats(tx *gorm.DB, userID uint, search string, filter string) ([]dto.QuizWithStats, error) {
	var results []dto.QuizWithStats

	baseQuery := `
		SELECT 
			q.id,
			q.level,
			q.created_at,
			q.title,
			q.description,
			ARRAY_AGG(DISTINCT ques.topic::text) FILTER (WHERE ques.topic IS NOT NULL) AS topics,
			COUNT(ques.id) AS question_count,
			COALESCE(ql.score, 0) AS score,
			ql.created_at AS completed_at
		FROM quiz q
		LEFT JOIN question ques ON q.id = ques.quiz_id
		LEFT JOIN quiz_log ql ON ql.quiz_id = q.id AND ql.user_id = ?
		WHERE 
			(ques.topic::text ILIKE ? OR q.level::text ILIKE ?)
	`

	args := []interface{}{userID, "%" + search + "%", "%" + search + "%"}

	if filter == "completed" {
		baseQuery += `
			AND EXISTS (
				SELECT 1 
				FROM quiz_log ql2 
				WHERE ql2.user_id = ? AND ql2.quiz_id = q.id
			)
		`
		args = append(args, userID)
	}

	baseQuery += `
		GROUP BY q.id, q.level, q.created_at, q.title, q.description, ql.score, ql.created_at
		ORDER BY q.created_at DESC
	`

	err := tx.Raw(baseQuery, args...).Scan(&results).Error
	if err != nil {
		return nil, err
	}

	var quizIDs []uint
	quizIndex := make(map[uint]*dto.QuizWithStats)

	for i := range results {
		quizIDs = append(quizIDs, results[i].ID)
		quizIndex[results[i].ID] = &results[i]
	}

	if len(quizIDs) > 0 {
		var questions []model.Question
		if err := tx.Where("quiz_id IN ?", quizIDs).Find(&questions).Error; err != nil {
			return nil, err
		}

		for _, q := range questions {
			if quiz, ok := quizIndex[q.QuizID]; ok {
				quiz.Questions = append(quiz.Questions, q)
			}
		}
	}

	return results, nil
}

func (r *QuizRepository) GetQuizByIDWithStats(tx *gorm.DB, userID, quizID uint) (dto.QuizWithStats, error) {
	var result dto.QuizWithStats

	query := `
		SELECT 
			q.id,
			q.level,
			q.created_at,
			q.title,
			q.description,
			ARRAY_AGG(DISTINCT ques.topic::text) FILTER (WHERE ques.topic IS NOT NULL) AS topics,
			COUNT(ques.id) AS question_count,
			COALESCE(ql.score, 0) AS score,
			ql.created_at AS completed_at
		FROM quiz q
		LEFT JOIN question ques ON q.id = ques.quiz_id
		LEFT JOIN quiz_log ql ON ql.quiz_id = q.id AND ql.user_id = ?
		WHERE q.id = ?
		GROUP BY q.id, q.level, q.created_at, q.title, q.description, ql.score, ql.created_at
	`

	if err := tx.Raw(query, userID, quizID).Scan(&result).Error; err != nil {
		return result, err
	}

	var questions []model.Question
	if err := tx.Where("quiz_id = ?", quizID).Find(&questions).Error; err != nil {
		return result, err
	}
	result.Questions = questions

	return result, nil
}

func (r *QuizRepository) GetTopicProficiency(db *gorm.DB, userID uint) ([]dto.TopicProficiencyFinal, error) {
	var result []dto.TopicProficiencyFinal

	query := `
		SELECT 
			q.topic,
			ROUND(
				(SUM(CASE WHEN ul.correct_answer THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0))::numeric, 
				2
			) AS score
		FROM user_log ul
		JOIN question q ON ul.question_id = q.id
		WHERE ul.user_id = ? AND ul.from_quiz = TRUE
		GROUP BY q.topic
	`

	err := db.Raw(query, userID).Scan(&result).Error
	if err != nil {
		return nil, err
	}

	return result, nil
}
