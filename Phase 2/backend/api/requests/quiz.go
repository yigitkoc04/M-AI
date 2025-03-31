package requests

type CreateQuestionRequest struct {
	Question string `json:"question" binding:"required"`
	Answer   string `json:"answer" binding:"required"`
}

type CreateQuizRequest struct {
	Level     string                  `json:"level" binding:"required"`
	Time      int                     `json:"time" binding:"required"`
	Questions []CreateQuestionRequest `json:"questions" binding:"required,dive"`
}
