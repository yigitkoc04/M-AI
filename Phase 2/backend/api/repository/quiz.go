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

func (r *QuizRepository) ListQuizzesWithUserStats(tx *gorm.DB, userID uint, search string) ([]dto.QuizWithStats, error) {
	var results []dto.QuizWithStats

	err := tx.Raw(`
		SELECT 
			q.id,
			q.topic,
			q.level,
			q.time,
			q.created_at,
			COUNT(CASE WHEN ul.correct_answer = true THEN 1 END) AS score,
			MAX(ul.created_at) AS completed_at,
			MAX(ul.created_at) <= q.created_at + (q.time || ' minutes')::interval AS completed_in_time
		FROM quiz q
		LEFT JOIN question ques ON q.id = ques.quiz_id
		LEFT JOIN user_log ul ON ul.question_id = ques.id AND ul.user_id = ?
		WHERE q.topic ILIKE ? OR q.level ILIKE ?
		GROUP BY q.id
		ORDER BY q.created_at DESC
	`, userID, "%"+search+"%", "%"+search+"%").Scan(&results).Error

	return results, err
}
