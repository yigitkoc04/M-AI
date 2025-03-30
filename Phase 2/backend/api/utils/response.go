package utils

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type APIResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func SendSuccess(c *gin.Context, message string, data any) {
	c.JSON(http.StatusOK, APIResponse{
		Status:  "success",
		Message: message,
		Data:    data,
	})
}

func SendError(c *gin.Context, httpStatus int, message string) {
	c.JSON(httpStatus, APIResponse{
		Status:  "error",
		Message: message,
		Data:    nil,
	})
}
