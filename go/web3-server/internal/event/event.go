package event

import (
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"log"
	"math/big"
	"web3-server/internal/blockchain"
	"web3-server/internal/config"
	"web3-server/internal/db"
	model "web3-server/internal/models"
)

func EventHandler(event *model.Event, vLog types.Log) {
	go func() {
		log.Printf("[%s][%s], user=%s, amount=%s, data=%s",
			event.EventName, event.EventCnName, event.Address, event.Amount, event.EventData)

		event.BlockNum = vLog.BlockNumber
		event.TxHash = vLog.TxHash.Hex()

		if err := db.D.Create(event).Error; err != nil {
			log.Printf("failed to insert event: %v", err)
		}

		fmt.Printf("余额：%s", erc20BalanceOf(event.Address))
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
