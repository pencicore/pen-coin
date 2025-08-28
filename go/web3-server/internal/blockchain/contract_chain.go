package blockchain

import (
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"golang.org/x/net/context"
	"strings"
)

// CallContractFunc 通用合约调用函数
func CallContractFunc(abiJSON string, contractAddr string, method string, args ...interface{}) ([]interface{}, error) {
	// 1. 解析 ABI
	parsedABI, err := abi.JSON(strings.NewReader(abiJSON))
	if err != nil {
		return nil, err
	}

	// 2. 打包参数
	data, err := parsedABI.Pack(method, args...)
	if err != nil {
		return nil, err
	}

	// 3. 构造 callMsg
	contract := common.HexToAddress(contractAddr)
	callMsg := ethereum.CallMsg{
		To:   &contract,
		Data: data,
	}

	// 4. 执行 eth_call
	res, err := Client.CallContract(context.Background(), callMsg, nil)
	if err != nil {
		return nil, err
	}

	// 5. 解码返回值
	out, err := parsedABI.Unpack(method, res)
	if err != nil {
		return nil, err
	}

	return out, nil
}
