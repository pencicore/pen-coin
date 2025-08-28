package config

import "math/big"

const EthRpcUrl = "https://code.pencilqbx.cn"
const EthRpcUrlWebsocket = "wss://code.pencilqbx.cn"
const MainAccountPrivateKey = "0x666b41e8a7fde8bdf0d58bc9aff55dec6f767f877eb76a21dcf94ed98d975f08"
const MainAccountAddress = "0xb55383173035093f74682bfa7282A3D541942aBb"

var FaucetAmount = new(big.Int).Mul(big.NewInt(5), big.NewInt(1e17)) // 0.5 ETH
const ERC20Address = "0x880C07a9116AF184A16b62829001F7E0F0e0F92f"
const FaucetAddress = "0x36b173c84AD0c4db60a1b8c293f44D3ecF1e97ff"
const ERC721Address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
