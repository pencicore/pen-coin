package event

import (
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/shopspring/decimal"
	"log"
	"math/big"
	"web3-server/internal/blockchain"
	"web3-server/internal/config"
	"web3-server/internal/db"
	model "web3-server/internal/models"
)

func Handler(event *model.Event, vLog types.Log) {
	go func() {
		log.Printf("[%s][%s], user=%s, amount=%s, data=%s",
			event.EventName, event.EventCnName, event.Address, event.Amount, event.EventData)

		event.BlockNum = vLog.BlockNumber
		event.TxHash = vLog.TxHash.Hex()
		event.Count = getMaxCount(event.Address) + 1

		if err := db.D.Create(event).Error; err != nil {
			log.Printf("failed to insert event: %v", err)
		}

		balance := erc20BalanceOf(event.Address)
		fmt.Printf("用户%s, 余额：%s", event.Address, balance)

		err := db.D.Create(&model.Balance{
			Address:      event.Address,
			Balance:      decimal.NewFromBigInt(balance, -18),
			TokenAddress: config.ERC20Address,
		}).Error
		if err != nil {
			log.Println("failed to insert balance:", err)
		}
	}()
}

func erc20BalanceOf(address string) *big.Int {
	result, err := blockchain.CallContractFunc(
		ERC20Abi,
		config.ERC20Address,
		"balanceOf",
		common.HexToAddress(address),
	)
	if err != nil {
		log.Fatal(err)
	}
	// 转换为 big.Int
	balance := result[0].(*big.Int)
	return balance
}

func getMaxCount(address string) uint64 {
	var maxCount uint64
	err := db.D.
		Model(&model.Event{}).
		Where("address = ?", address).
		Select("count").
		Order("count DESC").
		Limit(1).
		Scan(&maxCount).Error

	if err != nil {
		return 0
	}
	return maxCount
}
