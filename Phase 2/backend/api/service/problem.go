package service

import (
	"M-AI/api/model"
	"M-AI/api/repository"
	"M-AI/pkg/db"
	"errors"
	"gorm.io/gorm"
)

type ProblemService struct {
	problemRepo *repository.ProblemRepository
	db          *gorm.DB
}

func NewProblemService(db *gorm.DB, problemRepo *repository.ProblemRepository) *ProblemService {
	return &ProblemService{problemRepo: problemRepo, db: db}
}

func (s *ProblemService) CreateProblem(problem *model.Problem) error {
	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		return s.problemRepo.CreateProblem(tx, problem)
	})

	if err != nil {
		return InternalError("Failed to create problem", errors.New("create problem error"))
	}
	return nil
}
