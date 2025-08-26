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
	erc20ABI, _ := abi.JSON(strings.NewReader(event.ERC20Abi))
	erc20Address := config.ERC20Address

	manager := &EventManager{}

	manager.Events = append(manager.Events, EventSubscription{
		Address: common.HexToAddress(faucetAddress),
		EventID: faucetABI.Events["SendToken"].ID,
		ABI:     faucetABI,
		Handler: event.SendTokenHandle,
	})
	manager.Events = append(manager.Events, EventSubscription{
		Address: common.HexToAddress(erc20Address),
		EventID: erc20ABI.Events["Checkin"].ID,
		ABI:     erc20ABI,
		Handler: event.CheckinHandle,
	})

	if err := manager.Start(); err != nil {
		log.Fatal(err)
	}
}
