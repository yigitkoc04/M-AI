package model

import "gorm.io/gorm"

type UserLog struct {
	gorm.Model
	CorrectAnswer bool `json:"correct_answer"`
	QuestionID    uint `json:"question_id"`
	UserID        uint `json:"user_id"`
	FromQuiz      bool `json:"from_quiz"`
	ProblemID     uint `json:"problem_id"`
}
