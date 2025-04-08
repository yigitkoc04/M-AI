package model

import (
	"gorm.io/gorm"
)

type Quiz struct {
	gorm.Model
	Title       string `json:"title"`
	Description string `json:"description"`
	Level       string `json:"level"`
}

func (q Quiz) TableName() string {
	return "quiz"
}
