package service

import (
	"github.com/gin-gonic/gin"
	"strconv"
	"web3-server/internal/db"
	model "web3-server/internal/models"
	myUtils "web3-server/internal/utils"
)

func PageDrawHistory(c *gin.Context) {
	page := c.Query("page")
	size := c.Query("size")

	pageNum, err := strconv.Atoi(page)
	if err != nil || pageNum < 1 {
		pageNum = 1
	}
	pageSize, err := strconv.Atoi(size)
	if err != nil || pageSize < 1 {
		pageSize = 10
	}

	var total int64
	db.D.Model(&model.DrawHistory{}).Count(&total)

	var drawHistory []model.DrawHistory
	err = db.D.Order("id desc").
		Limit(pageSize).
		Offset((pageNum - 1) * pageSize).
		Find(&drawHistory).Error
	if err != nil {
		c.JSON(500, myUtils.Error(err.Error()))
		return
	}

	c.JSON(200, myUtils.Success(gin.H{
		"list":  drawHistory,
		"total": total,
		"page":  pageNum,
		"size":  pageSize,
	}))
}
