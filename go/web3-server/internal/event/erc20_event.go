package event

import (
	"errors"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"log"
	"math/big"
	"time"
	"web3-server/internal/blockchain"
	"web3-server/internal/config"
	"web3-server/internal/db"
	model "web3-server/internal/models"
)

func CheckinHandle(vLog types.Log, parsedABI abi.ABI) error {
	var e struct {
		User   common.Address
		Reward *big.Int
		Streak *big.Int
	}
	if err := parsedABI.UnpackIntoInterface(&e, "Checkin", vLog.Data); err != nil {
		return err
	}
	e.User = common.HexToAddress(vLog.Topics[1].Hex())
	Handler(&model.Event{
		Address:     e.User.Hex(),
		Amount:      decimal.NewFromBigInt(e.Reward, -18),
		EventName:   "Checkin",
		EventCnName: "打卡",
		EventData:   "",
	}, vLog)

	now := time.Now()
	record := model.ERC20CheckIn{
		ToAddress:   e.User.Hex(),
		FromAddress: config.ERC20Address,
		Reward:      decimal.NewFromBigInt(e.Reward, -18),
		Streak:      uint32(e.Streak.Int64()),
		CheckDate:   time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()),
	}
	if err := db.D.Create(&record).Error; err != nil {
		log.Println("保存打卡事件失败:", err)
	}

	var checkinMonth model.ERC20CheckInMonth
	year, month, day := now.Date()
	err := db.D.Where("address = ? AND year = ? AND month = ?", record.ToAddress, year, int(month)).
		First(&checkinMonth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			checkinMonth = model.ERC20CheckInMonth{
				Address:  record.ToAddress,
				Year:     year,
				Month:    int(month),
				Checkins: 0,
				Count:    0,
			}
		} else {
			log.Println("查询月度签到失败:", err)
			return err
		}
	}

	mask := uint32(1) << uint(day-1)
	if checkinMonth.Checkins&mask == 0 {
		checkinMonth.Checkins |= mask
		checkinMonth.Count++
	}
	if err := db.D.Save(&checkinMonth).Error; err != nil {
		log.Println("更新当月打卡信息失败:", err)
	}

	return nil
}

func LuckyDrawHandle(vLog types.Log, parsedABI abi.ABI) error {
	getAmountChange := func(reward string, cost *big.Int) decimal.Decimal {
		rewardMap := map[string]int64{
			"100 PEN": 100,
			"200 PEN": 200,
			"888 PEN": 888,
		}
		// 获取奖励数值（默认 0）
		rewardValue := rewardMap[reward]
		// 转换成 decimal，并调整到 18 位精度
		rewardNum := decimal.NewFromInt(rewardValue)
		// 扣除消耗
		costNum := decimal.NewFromBigInt(cost, -18)
		return rewardNum.Sub(costNum)
	}

	var e struct {
		User   common.Address
		Reward string
		Cost   *big.Int
	}
	if err := parsedABI.UnpackIntoInterface(&e, "LuckyDraw", vLog.Data); err != nil {
		return err
	}
	e.User = common.HexToAddress(vLog.Topics[1].Hex())
	Handler(&model.Event{
		Address:     e.User.Hex(),
		Amount:      getAmountChange(e.Reward, e.Cost),
		EventName:   "LuckyDraw",
		EventCnName: "抽奖",
		EventData:   e.Reward,
	}, vLog)

	now := time.Now()
	record := model.DrawHistory{
		Address:  e.User.Hex(),
		Reward:   e.Reward,
		Cost:     decimal.NewFromBigInt(e.Cost, -18),
		DrawDate: time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()),
	}
	if err := db.D.Create(&record).Error; err != nil {
		log.Println("保存抽奖事件失败:", err)
	}

	return nil
}

func SwapHandle(vLog types.Log, parsedABI abi.ABI) error {
	getAmount := func(AmountIn *big.Int, TokenIn string, AmountOut *big.Int) decimal.Decimal {
		if TokenIn == "PEN" {
			return decimal.NewFromBigInt(AmountIn, -18)
		} else {
			return decimal.NewFromBigInt(AmountOut, -18)
		}
	}

	var e struct {
		User      common.Address
		AmountIn  *big.Int
		TokenIn   string
		AmountOut *big.Int
		TokenOut  string
	}
	if err := parsedABI.UnpackIntoInterface(&e, "Swap", vLog.Data); err != nil {
		return err
	}
	e.User = common.HexToAddress(vLog.Topics[1].Hex())
	Handler(&model.Event{
		Address:     e.User.Hex(),
		Amount:      getAmount(e.AmountIn, e.TokenIn, e.AmountOut),
		EventName:   "Swap",
		EventCnName: "币币兑换",
		EventData:   e.TokenIn + "->" + e.TokenOut,
	}, vLog)

	record := model.ERC20Swap{
		Address:   e.User.Hex(),
		AmountIn:  decimal.NewFromBigInt(e.AmountIn, -18),
		AmountOut: decimal.NewFromBigInt(e.AmountOut, -18),
		TokenIn:   e.TokenIn,
		TokenOut:  e.TokenOut,
	}
	if err := db.D.Create(&record).Error; err != nil {
		log.Println("保存币币兑换事件失败:", err)
	}

	resReservePEN, err := blockchain.CallContractFunc(ERC20Abi, config.ERC20Address, "reservePEN")
	if err != nil {
		return err
	}
	reservePEN := resReservePEN[0].(*big.Int)
	resReserveETH, err := blockchain.CallContractFunc(ERC20Abi, config.ERC20Address, "reserveETH")
	if err != nil {
		return err
	}
	reserveETH := resReserveETH[0].(*big.Int)
	priceRecord := model.SwapPool{
		ReservePEN: decimal.NewFromBigInt(reservePEN, -18).Neg(),
		ReserveETH: decimal.NewFromBigInt(reserveETH, -18),
	}
	if err := db.D.Create(&priceRecord).Error; err != nil {
		log.Println("保存币币兑换价格失败:", err)
	}

	return nil
}

const ERC20Abi = `[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol_",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner_",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountPEN",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "liquidity",
				"type": "uint256"
			}
		],
		"name": "BurnLP",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "streak",
				"type": "uint256"
			}
		],
		"name": "Checkin",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reward",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			}
		],
		"name": "LuckyDraw",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountPEN",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "liquidity",
				"type": "uint256"
			}
		],
		"name": "MintLP",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "tokenIn",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "tokenOut",
				"type": "string"
			}
		],
		"name": "Swap",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountPEN",
				"type": "uint256"
			}
		],
		"name": "addLiquidity",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "liquidity",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "checkin",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "checkinBase",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "checkinDate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "checkinStreak",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reserveIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reserveOut",
				"type": "uint256"
			}
		],
		"name": "getAmountOut",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCheckinReward",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getETHPriceInPEN",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getLuckyDrawCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPENPriceInETH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lpBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "seed",
				"type": "uint256"
			}
		],
		"name": "luckyDraw",
		"outputs": [
			{
				"internalType": "string",
				"name": "reward",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "luckyDrawCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "luckyDrawDate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "seed",
				"type": "uint256"
			}
		],
		"name": "random",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "liquidity",
				"type": "uint256"
			}
		],
		"name": "removeLiquidity",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountPEN",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountETH",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reserveETH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reservePEN",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountOutMin",
				"type": "uint256"
			}
		],
		"name": "swapETHForPEN",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountOutMin",
				"type": "uint256"
			}
		],
		"name": "swapPENForETH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalLP",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]`
