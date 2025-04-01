package router

import (
	"M-AI/api/requests"
	"M-AI/api/service"
	"M-AI/api/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ProblemRouter struct {
	problemService *service.ProblemService
	aiService      *service.OpenAIService
}

func NewProblemRouter(problemService *service.ProblemService, aiService *service.OpenAIService) *ProblemRouter {
	return &ProblemRouter{problemService: problemService, aiService: aiService}
}

func (r *ProblemRouter) RegisterRoutes(router *gin.RouterGroup) {
	problemGroup := router.Group("/problems")
	{
		problemGroup.POST("", r.CreateProblem)
		problemGroup.POST("/image", r.CreateProblemWithImage)
	}
}

func (r *ProblemRouter) CreateProblem(c *gin.Context) {
	var req requests.CreateProblemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Set headers for streaming (again, redundancy here is safe)
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")
	c.Writer.Header().Set("X-Accel-Buffering", "no")

	if err := r.aiService.StreamPrompt(req.Question, c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Streaming failed", "details": err.Error()})
	}
}

func (r *ProblemRouter) CreateProblemWithImage(c *gin.Context) {
	var req struct {
		ImageBase64 string `json:"imageBase64"`
		Context     string `json:"context"`
	}

	if err := c.ShouldBindJSON(&req); err != nil || req.ImageBase64 == "" {
		utils.SendError(c, http.StatusBadRequest, "Invalid image or context.")
		return
	}

	// Set headers for streaming
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")
	c.Writer.Header().Set("X-Accel-Buffering", "no")

	// Call GPT image streaming service
	if err := r.aiService.StreamImagePrompt(req.ImageBase64, req.Context, c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Streaming failed",
			"details": err.Error(),
		})
	}
}
