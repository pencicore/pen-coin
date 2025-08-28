package server

import (
	"github.com/gin-gonic/gin"
	"web3-server/internal/service"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(corsHandler)

	faucet := r.Group("/faucet")
	{
		faucet.GET("/receiveETHBalance", service.ReceiveETHBalanceHandler)
		faucet.GET("/receivePENBalance", service.ReceivePENBalanceHandler)
		faucet.GET("/ethFaucet", service.ETHFaucetHandler)
		faucet.GET("/haveEthFaucet", service.HaveEthFaucetHandler)
	}
	erc20 := r.Group("/erc20")
	{
		erc20.GET("/getMonthCheckin", service.GetMonthCheckin)
		erc20.GET("/getMonthCheckinCount", service.GetMonthCheckinCount)
		erc20.GET("/getCheckinCount", service.GetCheckinCount)
		erc20.GET("/getCheckinInfo", service.GetCheckinInfo)
		erc20.GET("/getCheckinReward", service.GetCheckinReward)
	}
	draw := r.Group("/draw")
	{
		draw.GET("/pageDrawHistory", service.PageDrawHistory)
	}
	return r
}

func corsHandler(c *gin.Context) {
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
}
