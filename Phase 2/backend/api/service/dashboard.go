package service

import (
	"M-AI/api/dto"
	"M-AI/api/repository"
	"M-AI/pkg/db"
	"gorm.io/gorm"
)

type DashboardService struct {
	repo *repository.DashboardRepository
	db   *gorm.DB
}

func NewDashboardService(db *gorm.DB, repo *repository.DashboardRepository) *DashboardService {
	return &DashboardService{repo: repo, db: db}
}

func (s *DashboardService) GetStats(userID uint) (dto.DashboardStats, error) {
	var result dto.DashboardStats

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		stats, err := s.repo.GetDashboardStats(tx, userID)
		if err != nil {
			return err
		}
		result = stats
		return nil
	})

	return result, err
}

func (s *DashboardService) GetRecentActivity(userID uint) ([]dto.RecentActivity, error) {
	var result []dto.RecentActivity

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		activity, err := s.repo.GetRecentActivity(tx, userID)
		if err != nil {
			return err
		}
		result = activity
		return nil
	})

	return result, err
}

func (s *DashboardService) GetTopicProficiency(userID uint) ([]dto.TopicProficiency, error) {
	var result []dto.TopicProficiency

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		proficiency, err := s.repo.GetTopicProficiency(tx, userID)
		if err != nil {
			return err
		}
		result = proficiency
		return nil
	})

	return result, err
}

func (s *DashboardService) GetChallengingTopics(userID uint) ([]dto.ChallengingTopic, error) {
	var result []dto.ChallengingTopic

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		challenges, err := s.repo.GetChallengingTopics(tx, userID)
		if err != nil {
			return err
		}
		result = challenges
		return nil
	})

	return result, err
}
