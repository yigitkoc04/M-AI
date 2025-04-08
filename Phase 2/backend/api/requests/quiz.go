package requests

import "M-AI/api/constants"

type CreateQuizRequest struct {
	Title       string                  `json:"title" binding:"required"`
	Description string                  `json:"description" binding:"required"`
	Level       string                  `json:"level" binding:"required"`
	Questions   []CreateQuestionRequest `json:"questions" binding:"required"`
}

type CreateQuestionRequest struct {
	Question string              `json:"question" binding:"required"`
	Answer   string              `json:"answer" binding:"required"` // A/B/C/D
	AnswerA  string              `json:"answer_a" binding:"required"`
	AnswerB  string              `json:"answer_b" binding:"required"`
	AnswerC  string              `json:"answer_c" binding:"required"`
	AnswerD  string              `json:"answer_d" binding:"required"`
	Topic    constants.TopicEnum `json:"topic" binding:"required"`
}
