package server

import (
	"github.com/gin-gonic/gin"
	"web3-server/internal/service"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin) // allow this specific origin
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}
		c.Next()
	})

	eth := r.Group("/eth")
	{
		eth.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "hello"})
		})
	}
	faucet := r.Group("/faucet")
	{
		faucet.GET("/receiveETHBalance", service.ReceiveETHBalanceHandler)
		faucet.GET("/receivePENBalance", service.ReceivePENBalanceHandler)
		faucet.GET("/ethFaucet", service.ETHFaucetHandler)
	}
	return r
}
