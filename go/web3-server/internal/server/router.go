package server

import (
	"github.com/gin-gonic/gin"
	"web3-server/internal/service"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	eth := r.Group("/eth")
	{
		eth.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "hello"})
		})
		eth.GET("/faucet", service.FaucetHandler)
	}
	return r
}
