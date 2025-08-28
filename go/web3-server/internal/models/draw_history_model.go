package model

import (
	"log"
	"web3-server/internal/db"
)

func init() {
	err := db.D.AutoMigrate(&ERC20CheckIn{})
	if err != nil {
		log.Fatal("failed to migrate database:", err)
	}
}
