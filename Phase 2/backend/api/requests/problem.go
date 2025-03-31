package requests

import "M-AI/api/constants"

type CreateProblemRequest struct {
	Topic    constants.TopicEnum `json:"topic" binding:"required,oneof=Number Algebra 'Ratio, Proportion and Rates of Change' 'Geometry and measures' Probability Statistics"`
	Title    string              `json:"title" binding:"required"`
	Question string              `json:"question" binding:"required"`
}
