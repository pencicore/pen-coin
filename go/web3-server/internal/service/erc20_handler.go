package service

import (
	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
	"time"
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

func GetCheckinCount(c *gin.Context) {
	address := c.Query("address")
	var total int
	result := db.D.Model(&model.ERC20CheckInMonth{}).
		Where("address = ?", address).
		Select("SUM(Count) as total").
		Scan(&total)
	if result.Error != nil {
		c.JSON(200, utils.Success(0))
	} else {
		c.JSON(200, utils.Success(total))
	}
}

func GetMonthCheckinCount(c *gin.Context) {
	address := c.Query("address")
	year := c.Query("year")
	month := c.Query("month")
	var checkinMonth model.ERC20CheckInMonth
	err := db.D.Where("address = ? AND year = ? AND month = ?", address, year, month).
		First(&checkinMonth).Error
	if err != nil {
		c.JSON(200, utils.Success(0))
	} else {
		c.JSON(200, utils.Success(checkinMonth.Count))
	}
}

func GetCheckinInfo(c *gin.Context) {
	todayCount := int64(0)
	monthCount := int64(0)
	allCount := int64(0)
	now := time.Now()
	today := now.Format("2006-01-02")

	db.D.Model(&model.ERC20CheckIn{}).
		Where("check_date = ?", today).
		Count(&todayCount)
	db.D.Model(&model.ERC20CheckInMonth{}).
		Where("year = ? AND month = ?", now.Year(), int(now.Month())).
		Select("SUM(count)").Scan(&monthCount)
	db.D.Model(&model.ERC20CheckInMonth{}).
		Select("SUM(count)").Scan(&allCount)

	c.JSON(200, utils.Success(gin.H{
		"today": todayCount,
		"month": monthCount,
		"all":   allCount,
	}))
}

func GetCheckinReward(c *gin.Context) {
	address := c.Query("address")
	today := time.Now().Format("2006-01-02")

	var totalReward decimal.Decimal
	db.D.Model(&model.ERC20CheckIn{}).
		Where("to_address = ? AND check_date = ?", address, today).
		Select("COALESCE(SUM(reward), 0)").Scan(&totalReward)

	c.JSON(200, utils.Success(totalReward))
}
