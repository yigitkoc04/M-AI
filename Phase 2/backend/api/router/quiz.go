package router

import (
	"M-AI/api/requests"
	"M-AI/api/service"
	"M-AI/api/utils"
	"M-AI/internal/config"
	"M-AI/pkg/auth"
	"github.com/gin-gonic/gin"
	"net/http"
)

type QuizRouter struct {
	quizService *service.QuizService
}

func NewQuizRouter(quizService *service.QuizService) *QuizRouter {
	return &QuizRouter{quizService: quizService}
}

func (r *QuizRouter) RegisterRoutes(router *gin.RouterGroup) {
	quizGroup := router.Group("/quizzes", auth.AuthMiddleware(config.AppConfig.Auth.SecretKey))
	{
		quizGroup.POST("", r.CreateQuiz)
		quizGroup.GET("", r.ListQuizzes)
	}
}

func (r *QuizRouter) CreateQuiz(c *gin.Context) {
	var req requests.CreateQuizRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	err := r.quizService.CreateQuizWithQuestions(req)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to create quiz")
		return
	}

	utils.SendSuccess(c, "Quiz created successfully", nil)
}

func (r *QuizRouter) ListQuizzes(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userIDFloat, ok := userID.(float64)
	if !ok {
		utils.SendError(c, http.StatusInternalServerError, "Invalid user ID format")
		return
	}

	search := c.Query("search")

	quizzes, err := r.quizService.ListQuizzesWithUserStats(uint(userIDFloat), search)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to list quizzes")
		return
	}

	utils.SendSuccess(c, "Quizzes fetched successfully", quizzes)
}
