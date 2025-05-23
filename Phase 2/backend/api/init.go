package api

import (
	"M-AI/api/repository"
	"M-AI/api/router"
	"M-AI/api/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"time"
)

func InitRouter(db *gorm.DB) *gin.Engine {
	authRepo := repository.NewAuthRepository()
	resourceRepo := &repository.ResourceRepository{}
	problemRepo := &repository.ProblemRepository{}
	dashboardRepo := &repository.DashboardRepository{}
	quizzesRepo := &repository.QuizRepository{}
	quizLogRepo := &repository.QuizLogRepository{}
	userLogRepo := &repository.UserLogRepository{}
	questionRepo := &repository.QuestionRepository{}

	authService := service.NewAuthService(db, authRepo)
	resourceService := service.NewResourceService(db, resourceRepo)
	problemService := service.NewProblemService(db, problemRepo)
	dashboardService := service.NewDashboardService(db, dashboardRepo)
	aiService := service.NewOpenAIService()
	quizzesService := service.NewQuizService(db, quizzesRepo, quizLogRepo, userLogRepo, questionRepo, aiService)

	authRouter := router.NewAuthRouter(authService)
	resourceRouter := router.NewResourceRouter(resourceService)
	openAIService := service.NewOpenAIService()
	problemRouter := router.NewProblemRouter(problemService, openAIService)
	dashboardRouter := router.NewDashboardRouter(dashboardService)
	quizzesRouter := router.NewQuizRouter(quizzesService)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("X-Accel-Buffering", "no")
		c.Next()
	})

	apiV1 := r.Group("/api/v1")
	{
		authRouter.RegisterRoutes(apiV1)
		resourceRouter.RegisterRoutes(apiV1)
		problemRouter.RegisterRoutes(apiV1)
		dashboardRouter.RegisterRoutes(apiV1)
		quizzesRouter.RegisterRoutes(apiV1)
	}

	return r
}
