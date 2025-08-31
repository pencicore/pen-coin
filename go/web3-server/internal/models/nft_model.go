package model

import (
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	if err := db.D.AutoMigrate(&Nft{}); err != nil {
		log.Printf("Warning: failed to migrate Event table: %v", err)
	}
}

type Nft struct {
	ID        uint64    `gorm:"primaryKey;autoIncrement"`
	TokenId   uint      `gorm:"not null;index"`
	Address   string    `gorm:"size:42;not null;index"`
	ImageUrl  string    `gorm:"size:255;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime;"` // 新增组合索引
}
