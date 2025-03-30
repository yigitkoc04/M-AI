package repository

import (
	"M-AI/api/model"
	"gorm.io/gorm"
)

type ProblemRepository struct{}

func (r *ProblemRepository) CreateProblem(db *gorm.DB, problem *model.Problem) error {
	return db.Create(problem).Error
}
