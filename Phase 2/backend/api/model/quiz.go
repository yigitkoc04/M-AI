package model

import (
	"gorm.io/gorm"
)

type Quiz struct {
	gorm.Model
	Level     string     `json:"level"`
	Time      int        `json:"time"`
	Questions []Question `json:"questions"`
}
