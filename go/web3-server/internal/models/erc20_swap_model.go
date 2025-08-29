package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&ERC20Swap{}); err != nil {
		log.Printf("Warning: failed to migrate Erc20Swap table: %v", err)
	}
}

type ERC20Swap struct {
	ID        uint64          `gorm:"primaryKey;autoIncrement"`
	Address   string          `gorm:"size:42;not null;index"`
	AmountIn  decimal.Decimal `gorm:"type:decimal(30,18)"`
	TokenIn   string          `gorm:"size:10;not null"`
	AmountOut decimal.Decimal `gorm:"type:decimal(30,18)"`
	TokenOut  string          `gorm:"size:10;not null"`
	CreatedAt time.Time       `gorm:"autoCreateTime;index"`
}
