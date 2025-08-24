package service

import "github.com/gin-gonic/gin"

func FaucetHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "success"})
}
