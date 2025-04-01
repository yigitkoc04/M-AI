package requests

type CreateProblemRequest struct {
	Question string `json:"question" binding:"required"`
}
