package config

import "math/big"

const EthRpcUrl = "https://code.pencilqbx.cn"
const EthRpcUrlWebsocket = "wss://code.pencilqbx.cn"
const MainAccountPrivateKey = "0x666b41e8a7fde8bdf0d58bc9aff55dec6f767f877eb76a21dcf94ed98d975f08"
const MainAccountAddress = "0xb55383173035093f74682bfa7282A3D541942aBb"

var FaucetAmount = new(big.Int).Mul(big.NewInt(5), big.NewInt(1e17)) // 0.5 ETH
const ERC20Address = "0x7676f85A9dEcB4EF5bC11517538BD22dba7d15Ae"
const FaucetAddress = "0x88Da6020446f2e94d0a8428E7010b7F449459a73"
