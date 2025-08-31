package event

import (
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/shopspring/decimal"
	"log"
	"math/big"
	"web3-server/internal/config"
	"web3-server/internal/db"
	model "web3-server/internal/models"
)

func SendTokenHandle(vLog types.Log, parsedABI abi.ABI) error {
	var e struct {
		Receiver common.Address
		Amount   *big.Int
	}
	if err := parsedABI.UnpackIntoInterface(&e, "SendToken", vLog.Data); err != nil {
		return err
	}
	e.Receiver = common.HexToAddress(vLog.Topics[1].Hex())
	e.Amount = new(big.Int).SetBytes(vLog.Topics[2].Bytes())
	Handler(&model.Event{
		Address:     e.Receiver.Hex(),
		EventName:   "SendToken",
		EventCnName: "发放代币",
		EventData:   config.FaucetAddress,
		Amount:      decimal.NewFromBigInt(e.Amount, -18),
	}, vLog)

	record := model.FaucetPenHistory{
		ToAddress:   e.Receiver.Hex(),
		FromAddress: config.FaucetAddress,
		Amount:      decimal.NewFromBigInt(e.Amount, -18),
	}
	if err := db.D.Create(&record).Error; err != nil {
		log.Println("failed to insert faucet history:", err)
	}

	return nil
}
