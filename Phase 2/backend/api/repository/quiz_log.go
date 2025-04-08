package repository

import (
	"M-AI/api/model"
	"gorm.io/gorm"
)

type QuizLogRepository struct{}

func (r *QuizLogRepository) Create(db *gorm.DB, log *model.QuizLog) error {
	return db.Create(log).Error
}

func (r *QuizLogRepository) CreateBatch(db *gorm.DB, logs []model.QuizLog) error {
	if len(logs) == 0 {
		return nil
	}
	return db.Create(&logs).Error
}
