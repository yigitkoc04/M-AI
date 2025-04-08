package model

import (
	"M-AI/api/constants"
	"gorm.io/gorm"
)

type Question struct {
	gorm.Model
	QuizID   uint                `json:"quiz_id"`
	Question string              `json:"question"`
	Answer   string              `json:"answer"`
	AnswerA  string              `json:"answer_a" gorm:"column:answera"`
	AnswerB  string              `json:"answer_b" gorm:"column:answerb"`
	AnswerC  string              `json:"answer_c" gorm:"column:answerc"`
	AnswerD  string              `json:"answer_d" gorm:"column:answerd"`
	Topic    constants.TopicEnum `json:"topic"`
}

func (q Question) TableName() string {
	return "question"
}
