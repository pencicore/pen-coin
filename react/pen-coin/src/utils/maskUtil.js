import {localMaskUtil} from './localMaskUtil';
import metaMaskUtil from "./metaMaskUtil.js";
import {ethers} from "ethers";
import {ContractAddressConfig} from "../config/contractAddressConfig.js";

const maskUtil = {
    async isEmpty() {
        return localMaskUtil.isEmpty() && await metaMaskUtil.isEmpty()
    },
    async getAddress() {
        if (!localMaskUtil.isEmpty()) {
            return localMaskUtil.getAddressHandle()
        }
        if (!await metaMaskUtil.isEmpty()) {
            return await metaMaskUtil.getAddress()
        }
        return null
    },
    logout() {
        localMaskUtil.logout()
        metaMaskUtil.logout()
    },
    getProvider() {
        return new ethers.JsonRpcProvider(`${window.location.origin}/rpc`)
    },
    async getBalance() {
        const address = await this.getAddress()
        const provider = this.getProvider()
        return await provider.getBalance(address)
    },
}

export default maskUtil