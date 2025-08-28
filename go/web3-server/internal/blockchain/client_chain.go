package blockchain

import (
	"github.com/ethereum/go-ethereum/ethclient"
	"log"
	"web3-server/internal/config"
)

var Client *ethclient.Client

func init() {
	client, err := ethclient.Dial(config.EthRpcUrlWebsocket)
	if err != nil {
		log.Fatal(err)
	}
	Client = client
}
