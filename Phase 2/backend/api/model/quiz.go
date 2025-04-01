package model

import (
	"gorm.io/gorm"
)

type Quiz struct {
	gorm.Model
	Title     string     `json:"title"`
	Level     string     `json:"level"`
	Time      int        `json:"time"`
	Questions []Question `json:"questions"`
}
