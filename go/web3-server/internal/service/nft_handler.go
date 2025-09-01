package service

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
	"web3-server/internal/db"
	model "web3-server/internal/models"
	"web3-server/internal/utils"
)

func GetNftListHandler(c *gin.Context) {
	type NftInfo struct {
		TokenId  uint   `json:"tokenId"`
		ImageUrl string `json:"imageUrl"`
	}

	address := c.Query("address")
	var nftList []NftInfo

	if err := db.D.Model(&model.Nft{}).
		Select("token_id, image_url").
		Where("address = ?", address).
		Find(&nftList).Error; err != nil {
		log.Printf("failed to query nft list by address: %v", err)
		c.JSON(500, utils.Error("查询失败"))
		return
	}

	c.JSON(200, utils.Success(nftList))
}

func GetNftInfoHandler(c *gin.Context) {
	tokenIdStr := c.Query("tokenId")
	tokenId, err := strconv.ParseUint(tokenIdStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tokenId"})
		return
	}

	// 2. 查询 Nft 表
	var nft model.Nft
	if err := db.D.Where("token_id = ?", tokenId).First(&nft).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "NFT not found"})
		return
	}

	// 3. 查询 NftHistory 表
	var history []model.NftHistory
	if err := db.D.Where("token_id = ?", tokenId).Order("created_at DESC").Find(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query NFT history"})
		return
	}

	// 4. 返回结果
	c.JSON(http.StatusOK, utils.Success(gin.H{
		"nft":     nft,
		"history": history,
	}))
}
