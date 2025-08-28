package event

import (
	"github.com/ethereum/go-ethereum/core/types"
	"log"
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
	}()
}
