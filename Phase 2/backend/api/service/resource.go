package service

import (
	"M-AI/api/model"
	"M-AI/api/repository"
	"M-AI/pkg/db"
	"errors"
	"gorm.io/gorm"
)

type ResourceService struct {
	resourceRepo *repository.ResourceRepository
	db           *gorm.DB
}

func NewResourceService(db *gorm.DB, resourceRepo *repository.ResourceRepository) *ResourceService {
	return &ResourceService{resourceRepo: resourceRepo, db: db}
}

func (s *ResourceService) GetResources(search, level string) ([]model.Resource, error) {
	var result []model.Resource

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		resources, err := s.resourceRepo.GetResources(tx, search, level)
		if err != nil {
			return err
		}
		result = resources
		return nil
	})

	if err != nil {
		return nil, InternalError("Failed to fetch resources", errors.New("resource fetch error"))
	}
	return result, nil
}
