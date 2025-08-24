package blockchain

import (
	"context"
	"fmt"
	"web3-server/internal/config"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

func SendETH(to string) (string, error) {
	amountWei := config.FaucetAmount
	rpcURL := config.EthRpcUrl
	faucetPK := config.MainAccountPrivateKey

	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return "", err
	}
	defer client.Close()

	// 加载私钥
	privateKey, err := crypto.HexToECDSA(faucetPK[2:])
	if err != nil {
		return "", err
	}
	fromAddress := crypto.PubkeyToAddress(privateKey.PublicKey)
	fmt.Println("Sending from:", fromAddress.Hex())

	// 获取 nonce
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		return "", err
	}

	// 获取 gas price
	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		return "", err
	}

	toAddress := common.HexToAddress(to)

	// 构建交易 (LegacyTx)
	tx := types.NewTx(&types.LegacyTx{
		Nonce:    nonce,
		To:       &toAddress,
		Value:    amountWei,
		Gas:      21000,
		GasPrice: gasPrice,
	})

	// 使用 HomesteadSigner 签名，不管 chainID
	signedTx, err := types.SignTx(tx, types.HomesteadSigner{}, privateKey)
	if err != nil {
		return "", err
	}

	// 发送交易
	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return "", err
	}

	fmt.Println("TX hash:", signedTx.Hash().Hex())
	return signedTx.Hash().Hex(), nil
}
