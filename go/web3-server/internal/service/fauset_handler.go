package service

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
	"log"
	"web3-server/internal/blockchain"
	"web3-server/internal/config"
	"web3-server/internal/db"
	model "web3-server/internal/models"
)

func ReceiveETHBalanceHandler(c *gin.Context) {
	c.JSON(200, gin.H{"data": 10086})
}

func ReceivePENBalanceHandler(c *gin.Context) {
	c.JSON(200, gin.H{"data": 10086})
}

func ETHFaucetHandler(c *gin.Context) {
	address := c.Query("address")
	fromAddress := config.MainAccountAddress
	amountDecimal := decimal.NewFromBigInt(config.FaucetAmount, -18) // Wei → ETH

	if !common.IsHexAddress(address) {
		c.JSON(400, gin.H{"error": "invalid address"})
		return
	}

	// 1. 检查是否已经领取过
	var count int64
	if err := db.D.Model(&model.FaucetHistory{}).
		Where("to_address = ?", address).
		Count(&count).Error; err != nil {
		log.Println("db error:", err)
		c.JSON(500, gin.H{"error": "internal error"})
		return
	}
	if count > 0 {
		c.JSON(403, gin.H{"error": "this address has already claimed"})
		return
	}

	// 2. 发放 ETH
	txHash, err := blockchain.SendETH(address)
	if err != nil {
		log.Println("SendETH failed:", err)
		c.JSON(500, gin.H{"error": "send tx failed"})
		return
	}

	// 3. 记录数据库
	record := model.FaucetHistory{
		ToAddress:   address,
		FromAddress: fromAddress,
		Amount:      amountDecimal,
	}
	if err := db.D.Create(&record).Error; err != nil {
		log.Println("failed to insert faucet history:", err)
	}

	// 4. 返回结果
	c.JSON(200, gin.H{
		"status":  "success",
		"address": address,
		"amount":  config.FaucetAmount.String(), // big.Int 转字符串显示
		"txHash":  txHash,
	})
}
