package service

import (
	"github.com/gin-gonic/gin"
	"web3-server/internal/db"
	model "web3-server/internal/models"
	"web3-server/internal/utils"
)

func GetMonthCheckin(c *gin.Context) {
	year := c.Query("year")
	month := c.Query("month")
	address := c.Query("address")

	var checkinMonth model.ERC20CheckInMonth
	err := db.D.Where("address = ? AND year = ? AND month = ?", address, year, month).
		First(&checkinMonth).Error
	if err != nil {
		c.JSON(200, utils.Success(0))
	} else {
		c.JSON(200, utils.Success(checkinMonth.Checkins))
	}
}
