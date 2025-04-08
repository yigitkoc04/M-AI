package dto

import (
	"M-AI/api/model"
	"github.com/lib/pq"
	"time"
)

type QuizWithStats struct {
	ID            uint             `json:"id"`
	Level         string           `json:"level"`
	CreatedAt     time.Time        `json:"created_at"`
	Title         string           `json:"title"`
	Description   string           `json:"description"`
	Topics        pq.StringArray   `json:"topics" gorm:"type:text[]"`
	QuestionCount int              `json:"question_count"`
	Score         int              `json:"score"`
	CompletedAt   *time.Time       `json:"completed_at"`
	Questions     []model.Question `json:"questions" gorm:"-"`
}

type QuizSubmission struct {
	QuizID  uint            `json:"quiz_id"`
	UserID  uint            `json:"user_id"`
	Answers map[uint]string `json:"answers"`
}

type AIQuizRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Prompt      string `json:"prompt"`
	Level       string `json:"level"`
	UserID      uint   `json:"user_id"`
	PromptType  string `json:"prompt_type"`
}

type AIQuizQuestion struct {
	Title    string `json:"title"`
	Question string `json:"question"`
	Answer   string `json:"answer"`
	AnswerA  string `json:"answer_a"`
	AnswerB  string `json:"answer_b"`
	AnswerC  string `json:"answer_c"`
	AnswerD  string `json:"answer_d"`
	Topic    string `json:"topic"`
}

type AIQuizResponse struct {
	Questions []AIQuizQuestion `json:"questions"`
}

type TopicProficiencyFinal struct {
	Topic string  `json:"topic"`
	Score float64 `json:"score"`
}
