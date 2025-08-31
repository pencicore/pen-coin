package service

import (
	"github.com/gin-gonic/gin"
	"log"
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
