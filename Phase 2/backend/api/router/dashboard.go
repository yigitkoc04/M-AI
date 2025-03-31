package router

import (
	"M-AI/api/service"
	"M-AI/api/utils"
	"M-AI/internal/config"
	"M-AI/pkg/auth"
	"github.com/gin-gonic/gin"
	"net/http"
)

type DashboardRouter struct {
	dashboardService *service.DashboardService
}

func NewDashboardRouter(dashboardService *service.DashboardService) *DashboardRouter {
	return &DashboardRouter{dashboardService: dashboardService}
}

func (r *DashboardRouter) RegisterRoutes(router *gin.RouterGroup) {
	dashboardGroup := router.Group("/dashboard", auth.AuthMiddleware(config.AppConfig.Auth.SecretKey))
	{
		dashboardGroup.GET("/stats", r.GetStats)
		dashboardGroup.GET("/recent", r.GetRecentActivity)
		dashboardGroup.GET("/proficiency", r.GetTopicProficiency)
		dashboardGroup.GET("/challenges", r.GetChallengingTopics)
	}
}

func (r *DashboardRouter) GetStats(c *gin.Context) {
	userID := getUserID(c)
	stats, err := r.dashboardService.GetStats(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch stats")
		return
	}
	utils.SendSuccess(c, "Stats fetched", stats)
}

func (r *DashboardRouter) GetRecentActivity(c *gin.Context) {
	userID := getUserID(c)
	data, err := r.dashboardService.GetRecentActivity(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch recent activity")
		return
	}
	utils.SendSuccess(c, "Recent activity fetched", data)
}

func (r *DashboardRouter) GetTopicProficiency(c *gin.Context) {
	userID := getUserID(c)
	data, err := r.dashboardService.GetTopicProficiency(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch topic proficiency")
		return
	}
	utils.SendSuccess(c, "Topic proficiency fetched", data)
}

func (r *DashboardRouter) GetChallengingTopics(c *gin.Context) {
	userID := getUserID(c)
	data, err := r.dashboardService.GetChallengingTopics(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch challenging topics")
		return
	}
	utils.SendSuccess(c, "Challenging topics fetched", data)
}

func getUserID(c *gin.Context) uint {
	uid, _ := c.Get("user_id")
	return uint(uid.(float64))
}
