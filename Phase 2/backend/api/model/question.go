package model

import "gorm.io/gorm"

type Question struct {
	gorm.Model
	QuizID   uint   `json:"quiz_id"`
	Question string `json:"question"`
	Answer   string `json:"answer"`
}
