package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&Event{}); err != nil {
		log.Printf("Warning: failed to migrate Event table: %v", err)
	}
}

type Event struct {
	ID          uint64          `gorm:"primaryKey;autoIncrement"`
	Address     string          `gorm:"size:42;not null;index:idx_address_count,priority:1"`
	BlockNum    uint64          `gorm:"not null;index"`
	TxHash      string          `gorm:"size:66;not null;uniqueIndex"`
	EventName   string          `gorm:"size:100;not null"`
	EventCnName string          `gorm:"size:50;not null"`
	EventData   string          `gorm:"size:255;not null"`
	Amount      decimal.Decimal `gorm:"type:decimal(30,18);not null"`
	Count       uint64          `gorm:"not null;index:idx_address_count,priority:2"`
	CreatedAt   time.Time       `gorm:"autoCreateTime;index:idx_address_created,priority:2"` // 新增组合索引
}
