package listen

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum" // 正确的 FilterQuery
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"log"
	"web3-server/internal/config"
)

// EventManager 管理多个事件订阅
type EventManager struct {
	Events []EventSubscription
}

type EventSubscription struct {
	Address common.Address                 // 合约地址
	EventID common.Hash                    // ABI.Event.ID
	Handler func(types.Log, abi.ABI) error // 事件处理函数
	ABI     abi.ABI                        // ABI 对象，用于解析 log
}

// BuildQuery 构建 FilterQuery 监听所有事件
func (m *EventManager) BuildQuery() ethereum.FilterQuery {
	// 收集所有地址
	addrMap := make(map[common.Address]struct{})
	var addrs []common.Address
	var topics []common.Hash

	for _, e := range m.Events {
		if _, ok := addrMap[e.Address]; !ok {
			addrMap[e.Address] = struct{}{}
			addrs = append(addrs, e.Address)
		}
		topics = append(topics, e.EventID)
	}

	log.Println(fmt.Sprintf("Building event filter query: %d addresses, %d events", len(addrs), len(topics)))

	return ethereum.FilterQuery{
		Addresses: addrs,
		Topics:    [][]common.Hash{topics}, // 多事件
	}
}

// Start 启动监听
func (m *EventManager) Start() error {
	client, err := ethclient.Dial(config.EthRpcUrlWebsocket)
	if err != nil {
		log.Fatal(err)
	}
	query := m.BuildQuery()

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		return err
	}

	go func() {
		for {
			select {
			case err := <-sub.Err():
				println("Subscription error:", err.Error())
			case vLog := <-logs:
				// 分发到对应的 handler
				for _, e := range m.Events {
					if vLog.Address == e.Address && vLog.Topics[0] == e.EventID {
						if err := e.Handler(vLog, e.ABI); err != nil {
							println("Handler error:", err.Error())
						}
					}
				}
			}
		}
	}()

	log.Println("开启事件监听任务：" + config.EthRpcUrlWebsocket)

	return nil
}
