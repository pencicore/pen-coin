package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&SwapPool{}); err != nil {
		log.Printf("Warning: failed to migrate SwapPool table: %v", err)
	}
}

type SwapPool struct {
	ID         uint64          `gorm:"primaryKey;autoIncrement"`
	ReservePEN decimal.Decimal `gorm:"type:decimal(30,18)"`
	ReserveETH decimal.Decimal `gorm:"type:decimal(30,18)"`
	CreatedAt  time.Time       `gorm:"autoCreateTime;index"`
}
