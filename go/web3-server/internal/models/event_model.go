package model

import (
	"github.com/shopspring/decimal"
	"log"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&Event{}); err != nil {
		log.Printf("Warning: failed to migrate Event table: %v", err)
	}
}

type Event struct {
	ID          uint64          `gorm:"primaryKey;autoIncrement"`
	Address     string          `gorm:"size:42;not null;index:idx_address_eventname"` // 组合索引
	BlockNum    uint64          `gorm:"not null;index"`                               // 按区块号查询加索引
	TxHash      string          `gorm:"size:66;not null;uniqueIndex"`                 // 唯一索引
	EventName   string          `gorm:"size:100;not null;index:idx_address_eventname"`
	EventCnName string          `gorm:"size:50;not null"`
	EventData   string          `gorm:"size:255;not null"` // 可能较大
	Amount      decimal.Decimal `gorm:"type:decimal(30,18);not null"`
	CreatedAt   int64           `gorm:"autoCreateTime;index"` // 时间索引
}
