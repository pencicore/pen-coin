package event

import (
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/shopspring/decimal"
	"log"
	"math/big"
	"strconv"
	"web3-server/internal/db"
	model "web3-server/internal/models"
)

func NFTListedHandle(vLog types.Log, parsedABI abi.ABI) error {
	var e struct {
		TokenId  uint
		Seller   common.Address
		Price    *big.Int
		PayToken common.Address
	}
	e.TokenId = uint(new(big.Int).SetBytes(vLog.Topics[1].Bytes()).Uint64())
	e.Seller = common.HexToAddress(vLog.Topics[2].Hex())
	if err := parsedABI.UnpackIntoInterface(&e, "NFTListed", vLog.Data); err != nil {
		return err
	}

	Handler(&model.Event{
		Address:     e.Seller.Hex(),
		Amount:      decimal.NewFromBigInt(e.Price, -18),
		EventName:   "NFTListed",
		EventCnName: "NFT上架",
		EventData:   strconv.Itoa(int(e.TokenId)),
	}, vLog)

	var nft model.Nft
	if err := db.D.Where("token_id = ?", e.TokenId).First(&nft).Error; err != nil {
		log.Printf("Warning: NFT not found for tokenId=%d: %v", e.TokenId, err)
	}

	record := model.NftListing{
		TokenId:       e.TokenId,
		SellerAddress: e.Seller.Hex(),
		ImageUrl:      nft.ImageUrl,
		Price:         decimal.NewFromBigInt(e.Price, -18),
	}
	db.D.Create(&record)

	return nil
}
