package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&NftHistory{}); err != nil {
		log.Printf("Warning: failed to migrate NftHistory table: %v", err)
	}
}

type NftHistory struct {
	ID          uint64          `gorm:"primaryKey;autoIncrement"`
	TokenId     uint            `gorm:"not null;index"`
	FromAddress string          `gorm:"size:42;not null;"`
	ToAddress   string          `gorm:"size:42;not null;"`
	TradeType   string          `gorm:"size:42;not null;"`
	Amount      decimal.Decimal `gorm:"type:decimal(30,18);not null"`
	CreatedAt   time.Time       `gorm:"autoCreateTime;"` // 新增组合索引
}
