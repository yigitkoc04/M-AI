package repository

import (
	"M-AI/api/constants"
	"M-AI/api/model"
	"strings"

	"gorm.io/gorm"
)

type ResourceRepository struct{}

func (r *ResourceRepository) GetResources(db *gorm.DB, search string, level string) ([]model.Resource, error) {
	var resources []model.Resource

	query := db.Model(&model.Resource{})

	if search != "" {
		likeQuery := "%" + search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", likeQuery, likeQuery)
	}

	if level != "" {
		level = strings.ToLower(level)
		if level == constants.LevelBeginner || level == constants.LevelIntermediate || level == constants.LevelAdvanced {
			query = query.Where("LOWER(level) = ?", level)
		}
	}

	err := query.Find(&resources).Error
	return resources, err
}
