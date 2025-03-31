package router

import (
	"M-AI/api/model"
	"M-AI/api/requests"
	"M-AI/api/service"
	"M-AI/api/utils"
	"M-AI/internal/config"
	"M-AI/pkg/auth"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ProblemRouter struct {
	problemService *service.ProblemService
}

func NewProblemRouter(problemService *service.ProblemService) *ProblemRouter {
	return &ProblemRouter{problemService: problemService}
}

func (r *ProblemRouter) RegisterRoutes(router *gin.RouterGroup) {
	problemGroup := router.Group("/problems", auth.AuthMiddleware(config.AppConfig.Auth.SecretKey))
	{
		problemGroup.POST("", r.CreateProblem)
	}
}

func (r *ProblemRouter) CreateProblem(c *gin.Context) {
	var req requests.CreateProblemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	problem := model.Problem{
		Topic:    req.Topic,
		Title:    req.Title,
		Question: req.Question,
	}

	err := r.problemService.CreateProblem(&problem)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to create problem")
		return
	}

	utils.SendSuccess(c, "Problem created successfully", problem)
}
