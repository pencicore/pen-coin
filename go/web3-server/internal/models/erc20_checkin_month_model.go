package model

import (
	"log"
	"time"
	"web3-server/internal/db"
)

func init() {
	err := db.D.AutoMigrate(&ERC20CheckInMonth{})
	if err != nil {
		log.Fatal("failed to migrate monthly checkin table:", err)
	}
}

// ERC20CheckInMonth 月度签到表
type ERC20CheckInMonth struct {
	ID        uint64    `gorm:"primaryKey;autoIncrement"`
	Address   string    `gorm:"size:255;not null;uniqueIndex:uniq_user_month"`
	Year      int       `gorm:"not null;uniqueIndex:uniq_user_month"`
	Month     int       `gorm:"not null;uniqueIndex:uniq_user_month"`
	Checkins  uint32    `gorm:"not null"` // bitmask，低位表示1号，高位表示31号
	Count     uint32    `gorm:"not null"` // 当月累计签到天数
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
