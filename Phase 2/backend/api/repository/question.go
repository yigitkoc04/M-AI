package repository

import (
	"M-AI/api/model"
	"gorm.io/gorm"
)

type QuestionRepository struct{}

func (r *QuestionRepository) GetByQuizID(tx *gorm.DB, quizID uint) ([]model.Question, error) {
	var questions []model.Question
	err := tx.Where("quiz_id = ?", quizID).Find(&questions).Error
	return questions, err
}
