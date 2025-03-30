package router

import (
	"M-AI/api/service"
	"M-AI/api/utils"
	"M-AI/internal/config"
	"M-AI/pkg/auth"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ResourceRouter struct {
	resourceService *service.ResourceService
}

func NewResourceRouter(resourceService *service.ResourceService) *ResourceRouter {
	return &ResourceRouter{resourceService: resourceService}
}

func (r *ResourceRouter) RegisterRoutes(router *gin.RouterGroup) {
	resourceGroup := router.Group("/resources", auth.AuthMiddleware(config.AppConfig.Auth.SecretKey))
	{
		resourceGroup.GET("", r.GetResources)
	}
}

func (r *ResourceRouter) GetResources(c *gin.Context) {
	search := c.Query("search")
	level := c.Query("level")

	resources, err := r.resourceService.GetResources(search, level)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch resources")
		return
	}

	utils.SendSuccess(c, "Resources fetched successfully", resources)
}
