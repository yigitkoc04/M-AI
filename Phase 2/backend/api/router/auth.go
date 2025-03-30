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

type AuthRouter struct {
	authService *service.AuthService
}

func NewAuthRouter(authService *service.AuthService) *AuthRouter {
	return &AuthRouter{authService: authService}
}

func (r *AuthRouter) RegisterRoutes(router *gin.RouterGroup) {
	authGroup := router.Group("/auth")
	{
		authGroup.POST("/login", r.Login)
		authGroup.POST("/logout", r.Logout)
		authGroup.POST("/signup", r.SignUp)
		authGroup.GET("/me", auth.AuthMiddleware(config.AppConfig.Auth.SecretKey), r.GetCurrentUser)
		authGroup.PUT("/me/name", auth.AuthMiddleware(config.AppConfig.Auth.SecretKey), r.ChangeName)
		authGroup.PUT("/me/password", auth.AuthMiddleware(config.AppConfig.Auth.SecretKey), r.ChangePassword)
	}
}

func (r *AuthRouter) SignUp(c *gin.Context) {
	var req requests.SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	user := &model.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
	}

	err := r.authService.SignUp(user)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to register user")
		return
	}

	utils.SendSuccess(c, "Signup successful", nil)
}

func (r *AuthRouter) Login(c *gin.Context) {
	var req requests.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := r.authService.AuthenticateUser(req.Email, req.Password)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	token, err := auth.GenerateToken(user.ID, config.AppConfig.Auth.SecretKey)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	c.SetCookie(
		"token",
		token,
		86400,
		"/",
		"",
		true,
		true,
	)

	utils.SendSuccess(c, "Login successful", nil)
}

func (r *AuthRouter) Logout(c *gin.Context) {
	c.SetCookie(
		"token",
		"",
		-1,
		"/",
		"",
		true,
		true,
	)

	utils.SendSuccess(c, "Logged out successfully", nil)
}

func (r *AuthRouter) GetCurrentUser(c *gin.Context) {
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

	user, err := r.authService.GetUserByID(uint(userIDFloat))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "User not found")
		return
	}

	utils.SendSuccess(c, "User fetched successfully", user)
}

func (r *AuthRouter) ChangeName(c *gin.Context) {
	var req requests.ChangeNameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userIDUint := uint(userID.(float64))

	err := r.authService.ChangeUserName(userIDUint, req.Name)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to update name")
		return
	}

	utils.SendSuccess(c, "Name updated successfully", nil)
}

func (r *AuthRouter) ChangePassword(c *gin.Context) {
	var req requests.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userIDUint := uint(userID.(float64))

	err := r.authService.ChangeUserPassword(userIDUint, req.OldPassword, req.NewPassword)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.SendSuccess(c, "Password changed successfully", nil)
}
