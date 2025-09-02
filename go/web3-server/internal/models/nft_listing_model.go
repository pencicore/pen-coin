package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&NftListing{}); err != nil {
		log.Printf("Warning: failed to migrate NftListing table: %v", err)
	}
}

type NftListing struct {
	ID            uint64          `gorm:"primaryKey;autoIncrement"`
	TokenId       uint            `gorm:"not null;index"`
	SellerAddress string          `gorm:"size:42;not null;index"`
	ImageUrl      string          `gorm:"size:255;not null"`
	Price         decimal.Decimal `gorm:"type:decimal(30,18);not null"`
	CreatedAt     time.Time       `gorm:"autoCreateTime;"` // 新增组合索引
}
