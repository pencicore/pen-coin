package start

import (
	"github.com/shopspring/decimal"
	"log"
	"strconv"
	"web3-server/internal/config"
	"web3-server/internal/db"
	model "web3-server/internal/models"
)

func InitNftData() {

	var count int64
	if err := db.D.Model(&model.Nft{}).Count(&count).Error; err != nil {
		log.Printf("failed to count nft table: %v", err)
		return
	}

	if count > 0 {
		return
	}

	// 批量生成 480 条数据
	nfts := make([]model.Nft, 0, 480)
	for i := 1; i <= 480; i++ {
		nfts = append(nfts, model.Nft{
			TokenId:  uint(i),
			Address:  config.NftMainAccountAddress, // 默认地址
			ImageUrl: "https://pen-coin.oss-cn-chengdu.aliyuncs.com/nft/images/" + strconv.Itoa(i) + ".png",
		})
	}

	if err := db.D.Create(&nfts).Error; err != nil {
		log.Printf("failed to insert initial nft data: %v", err)
	} else {
		log.Printf("successfully inserted %d nft rows", len(nfts))
	}
}

func initNftHistoryData() {

	var count int64
	if err := db.D.Model(&model.NftHistory{}).Count(&count).Error; err != nil {
		log.Printf("failed to count nft table: %v", err)
		return
	}

	if count > 0 {
		return
	}

	// 批量生成 480 条数据
	nfts := make([]model.NftHistory, 0, 480)
	for i := 1; i <= 480; i++ {
		nfts = append(nfts, model.NftHistory{
			TokenId:     uint(i),
			FromAddress: config.ERC721Address,
			ToAddress:   config.NftMainAccountAddress,
			TradeType:   "铸造",
			Amount:      decimal.NewFromInt(0),
		})
	}

	if err := db.D.Create(&nfts).Error; err != nil {
		log.Printf("failed to insert initial nft data: %v", err)
	} else {
		log.Printf("successfully inserted %d nft rows", len(nfts))
	}
}
