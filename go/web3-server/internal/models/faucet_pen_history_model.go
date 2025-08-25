package model

import (
	"fmt"
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	err := db.D.AutoMigrate(&FaucetPenHistory{})
	if err != nil {
		log.Fatal("failed to migrate database:", err)
	}
	fmt.Println("Migration completed ✅")
}

type FaucetPenHistory struct {
	ID          uint64          `gorm:"primaryKey;autoIncrement"`
	ToAddress   string          `gorm:"size:255;not null;uniqueIndex"`
	FromAddress string          `gorm:"size:255;not null;"`
	Amount      decimal.Decimal `gorm:"type:decimal(30,18);not null"` // ETH
	CreatedAt   time.Time       `gorm:"autoCreateTime"`
}
