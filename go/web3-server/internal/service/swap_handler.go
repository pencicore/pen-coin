package service

import (
	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
	"net/http"
	"strconv"
	"web3-server/internal/db"
	model "web3-server/internal/models"
	"web3-server/internal/utils"
)

func PageSwapHistory(c *gin.Context) {
	pageStr := c.Query("page")
	sizeStr := c.Query("size")

	// 默认分页参数
	page := 1
	size := 10

	// 转换分页参数
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	if sizeStr != "" {
		if s, err := strconv.Atoi(sizeStr); err == nil && s > 0 {
			size = s
		}
	}

	// 查询总数
	var total int64
	if err := db.D.Model(&model.ERC20Swap{}).
		Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}

	// 查询列表
	var swapHistory []model.ERC20Swap
	if err := db.D.
		Order("created_at DESC").
		Offset((page - 1) * size).
		Limit(size).
		Find(&swapHistory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}

	// 返回结果
	c.JSON(http.StatusOK, utils.Success(gin.H{
		"list":  swapHistory,
		"total": total,
		"page":  page,
		"size":  size,
	}))
}

func GetSwapHistory(c *gin.Context) {
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
	var swap []model.SwapPool
	if err := db.D.Where("created_at BETWEEN ? AND ?",
		begin, end).
		Order("created_at asc").
		Find(&swap).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 只返回需要的字段
	type SwapResp struct {
		ReservePEN decimal.Decimal `json:"reservePEN"`
		ReserveETH decimal.Decimal `json:"reserveETH"`
		CreatedAt  string          `json:"createdAt"`
	}

	result := make([]SwapResp, 0, len(swap))
	for _, b := range swap {
		result = append(result, SwapResp{
			ReservePEN: b.ReservePEN,
			ReserveETH: b.ReserveETH,
			CreatedAt:  b.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, utils.Success(result))
}
