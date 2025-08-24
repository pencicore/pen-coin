package db

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"time"
	"web3-server/internal/config"
)

var D *gorm.DB

func init() {
	D, _ = gorm.Open(mysql.Open(config.MYSQL_URL), &gorm.Config{})

	// 获取底层的sql.DB对象
	sqlDB, err := D.DB()
	if err != nil {
		fmt.Println("Failed to get sql.DB object:", err)
		return
	}

	// 设置连接池参数
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(time.Duration(100) * time.Second)
}
