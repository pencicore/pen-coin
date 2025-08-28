package model

import (
	"github.com/shopspring/decimal"
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	err := db.D.AutoMigrate(&DrawHistory{})
	if err != nil {
		log.Fatal("failed to migrate database:", err)
	}
}

type DrawHistory struct {
	ID        uint64          `gorm:"primaryKey;autoIncrement"`
	Address   string          `gorm:"size:255;not null;index"`
	Reward    string          `gorm:"size:255;not null"`
	Cost      decimal.Decimal `gorm:"type:decimal(30,18);not null"`
	DrawDate  time.Time       `gorm:"type:date;not null;"`
	CreatedAt time.Time       `gorm:"autoCreateTime"`
}
