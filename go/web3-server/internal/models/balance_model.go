package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&Balance{}); err != nil {
		log.Printf("Warning: failed to migrate Event table: %v", err)
	}
}

type Balance struct {
	ID           uint64          `gorm:"primaryKey;autoIncrement"`
	Address      string          `gorm:"size:42;not null;index:idx_token_user_time,priority:1"`
	TokenAddress string          `gorm:"size:42;not null;index:idx_token_user_time,priority:3"`
	Balance      decimal.Decimal `gorm:"type:decimal(30,18);not null"`
	CreatedAt    time.Time       `gorm:"autoCreateTime;index:idx_token_user_time,priority:2"`
}
