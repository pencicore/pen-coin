package listen

import (
	"log"
	"strings"
	"web3-server/internal/config"
	"web3-server/internal/event"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
)

func Listen() {
	faucetABI, _ := abi.JSON(strings.NewReader(event.FaucetAbi))
	faucetAddress := config.FaucetAddress

	manager := &EventManager{}

	manager.Events = append(manager.Events, EventSubscription{
		Address: common.HexToAddress(faucetAddress),
		EventID: faucetABI.Events["SendToken"].ID,
		ABI:     faucetABI,
		Handler: event.SendTokenHandle,
	})

	if err := manager.Start(); err != nil {
		log.Fatal(err)
	}
}
