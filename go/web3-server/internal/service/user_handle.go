package service

import (
	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
	"net/http"
	"time"
	"web3-server/internal/db"
	model "web3-server/internal/models"
	"web3-server/internal/utils"
)

func GetBalanceHistory(c *gin.Context) {
	address := c.Query("address")
	beginStr := c.Query("begin")
	endStr := c.Query("end")

	// 解析时间
	begin, err := utils.ParseDateTime(beginStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("时间格式错误"))
		return
	}
	end, err := utils.ParseDateTime(endStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("时间格式错误"))
		return
	}

	// 查询数据库
	var balances []model.Balance
	if err := db.D.Where("address = ? AND created_at BETWEEN ? AND ?",
		address, begin, end).
		Order("created_at asc").
		Find(&balances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 只返回需要的字段
	type BalanceResp struct {
		Balance   string `json:"balance"`
		CreatedAt string `json:"createdAt"`
	}

	result := make([]BalanceResp, 0, len(balances))
	for _, b := range balances {
		result = append(result, BalanceResp{
			Balance:   b.Balance.String(), // decimal 转 string
			CreatedAt: b.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, utils.Success(result))
}

func GetUserInfo(c *gin.Context) {
	address := c.Query("address")

	// 今天
	now := time.Now()
	todayCount := getDailyOpCount(address, now)

	// 昨天
	yesterday := now.AddDate(0, 0, -1)
	yesterdayCount := getDailyOpCount(address, yesterday)

	// 今天
	todayBalance := getLatestBalanceBefore(address, now)

	// 昨天
	yesterdayBalance := getLatestBalanceBefore(address, yesterday)

	c.JSON(http.StatusOK, utils.Success(map[string]interface{}{
		"todayCount":       todayCount,
		"yesterdayCount":   yesterdayCount,
		"todayBalance":     todayBalance,
		"yesterdayBalance": yesterdayBalance,
	}))
}

func getDailyOpCount(address string, day time.Time) int64 {
	dayStart := time.Date(day.Year(), day.Month(), day.Day(), 0, 0, 0, 0, day.Location())
	dayEnd := dayStart.Add(24 * time.Hour).Add(-time.Second)

	var total int64
	err := db.D.
		Model(&model.Event{}).
		Where("address = ? AND created_at BETWEEN ? AND ?", address, dayStart, dayEnd).
		Count(&total).Error
	if err != nil {
		return 0
	}
	return total
}

func getLatestBalanceBefore(address string, day time.Time) decimal.Decimal {
	var bal model.Balance
	err := db.D.
		Where("address = ? AND created_at < ?", address, day).
		Order("created_at DESC").
		Limit(1).
		First(&bal).Error
	if err != nil {
		return decimal.NewFromInt(0)
	}
	return bal.Balance
}
