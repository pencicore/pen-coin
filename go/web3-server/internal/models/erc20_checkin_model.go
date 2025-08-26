package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	err := db.D.AutoMigrate(&ERC20CheckIn{})
	if err != nil {
		log.Fatal("failed to migrate database:", err)
	}
}

type ERC20CheckIn struct {
	ID          uint64          `gorm:"primaryKey;autoIncrement"`
	ToAddress   string          `gorm:"size:255;not null;index:uniq_user_date"`
	FromAddress string          `gorm:"size:255;not null"`
	Reward      decimal.Decimal `gorm:"type:decimal(30,18);not null"`
	Streak      uint32          `gorm:"not null"` // 连续签到天数
	CheckDate   time.Time       `gorm:"type:date;not null;index:uniq_user_date"`
	CreatedAt   time.Time       `gorm:"autoCreateTime"`
}
