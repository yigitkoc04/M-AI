package repository

import (
	"M-AI/api/model"
	"gorm.io/gorm"
)

type UserLogRepository struct{}

func (r *UserLogRepository) Create(db *gorm.DB, log *model.UserLog) error {
	return db.Create(log).Error
}

func (r *UserLogRepository) CreateBatch(db *gorm.DB, logs []model.UserLog) error {
	if len(logs) == 0 {
		return nil
	}
	return db.Create(&logs).Error
}
