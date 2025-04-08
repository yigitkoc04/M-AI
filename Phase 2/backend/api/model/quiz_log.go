package model

import "gorm.io/gorm"

type QuizLog struct {
	gorm.Model
	QuizID uint `json:"quiz_id"`
	UserID uint `json:"user_id"`
	Score  int  `json:"score"`
}

func (q QuizLog) TableName() string {
	return "quiz_log"
}
