package requests

type CreateProblemRequest struct {
	Topic    string `json:"topic" binding:"required,oneof=Number Algebra 'Ratio, Proportion and Rates of Change' 'Geometry and measures' Probability Statistics"`
	Title    string `json:"title" binding:"required"`
	Question string `json:"question" binding:"required"`
}
