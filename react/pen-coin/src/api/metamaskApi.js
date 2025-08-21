import {networkData} from "../config/metamaskConfig.js";

const metamaskApi = {
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
    }
}

export default metamaskApi