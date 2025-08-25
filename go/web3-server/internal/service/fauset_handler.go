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
	"web3-server/internal/utils"
)

func ReceiveETHBalanceHandler(c *gin.Context) {
	var totalStr string
	err := db.D.Model(&model.FaucetHistory{}).
		Select("SUM(amount) as total").
		Scan(&totalStr).Error
	if err != nil {
		panic(err)
	}
	c.JSON(200, utils.Success(totalStr))
}

func ETHFaucetHandler(c *gin.Context) {
	address := c.Query("address")
	fromAddress := config.MainAccountAddress
	amountDecimal := decimal.NewFromBigInt(config.FaucetAmount, -18) // Wei → ETH

	if !common.IsHexAddress(address) {
		c.JSON(400, utils.Error("账户地址格式错误"))
		return
	}

	// 1. 检查是否已经领取过
	var count int64
	db.D.Model(&model.FaucetHistory{}).Where("to_address = ?", address).Count(&count)
	if count > 0 {
		c.JSON(403, utils.Error("该账户已领取"))
		return
	}

	// 2. 发放 ETH
	txHash, err := blockchain.SendETH(address)
	if err != nil {
		c.JSON(500, utils.Error("ETH发送失败"))
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
	data := map[string]interface{}{
		"status":  "success",
		"address": address,
		"amount":  config.FaucetAmount.String(),
		"txHash":  txHash,
	}
	c.JSON(200, utils.Success(data))
}

func HaveEthFaucetHandler(c *gin.Context) {
	address := c.Query("address")
	var count int64
	db.D.Model(&model.FaucetHistory{}).Where("to_address = ?", address).Count(&count)
	c.JSON(200, utils.Success(count))
}

func ReceivePENBalanceHandler(c *gin.Context) {
	var totalStr string
	err := db.D.Model(&model.FaucetPenHistory{}).
		Select("SUM(amount) as total").
		Scan(&totalStr).Error
	if err != nil {
		panic(err)
	}
	c.JSON(200, utils.Success(totalStr))
}
