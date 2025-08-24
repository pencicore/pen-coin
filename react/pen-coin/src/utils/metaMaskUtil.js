import {networkData} from "../config/metamaskConfig.js";
import {ethers} from "ethers";

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