import {networkData} from "../config/metamaskConfig.js";
import {ethers} from "ethers";
import {ContractAddressConfig} from "../config/contractAddressConfig.js";

const LOGIN_INFO = "login_info";
const LOGIN_YES = "login_metamask"
const LOGIN_NO = "login_no"

const loginInfo = {
    isLogin: false,
    login() {
        localStorage.setItem(LOGIN_INFO, LOGIN_YES)
    },
    logout() {
        localStorage.setItem(LOGIN_INFO, LOGIN_NO)
    },
    check() {
        const info = localStorage.getItem(LOGIN_INFO)
        return info != null && info === LOGIN_YES
    }
}

export const metamaskApi = {
    checkMetamask() {
        return typeof window.ethereum !== "undefined"
    },
    async checkConnect() {
        if(!this.checkMetamask()) return false
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts.length > 0
    },
    async connect() {
        if(!this.checkMetamask()) return false
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts.length > 0
        }
        catch (e) {
            console.error("连接钱包失败", e)
            return false
        }
    },
    async addChainNet() {
        if(!this.checkMetamask()) return false
        try {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [networkData],
            })
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: networkData.chainId }],
            });
            return true
        } catch (err) {
            console.error("添加网络失败", err)
            return false
        }
    },
    async getAddress() {
        if(!this.checkMetamask()) return false
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            return accounts[0]
        }
        catch (err) {
            console.error("获取地址失败", err)
            return null
        }
    },
    async addTokenToMetaMask() {
        const tokenAddress = ContractAddressConfig.ERC20
        const tokenSymbol = "PEN";
        const tokenDecimals = 18;
        const tokenImage = "https://tse1-mm.cn.bing.net/th/id/OIP-C.DPFqf-DHxiMQPr4GdHUY6AHaII?w=169&h=188&c=7&r=0&o=5&pid=1.7"; // 可选

        try {
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage,
                    },
                },
            });

            if (wasAdded) {
                console.log("代币已添加到钱包");
            } else {
                console.log("用户拒绝添加代币");
            }
        } catch (err) {
            console.error(err);
        }
    }

}

const metaMaskUtil = {
    async isEmpty() {
        return !(loginInfo.check() && await metamaskApi.checkConnect())
    },
    async getAddress() {
        return await metamaskApi.getAddress()
    },
    logout() {
        loginInfo.logout()
    },
    async login() {
        await metamaskApi.connect()
        await metamaskApi.addChainNet()
        loginInfo.login()
    },
    async getSingle() {
        if (!window.ethereum) {
            throw new Error("MetaMask not installed!");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        console.log("Connected wallet:", await signer.getAddress());
        return signer;
    }
 }

 export default metaMaskUtil