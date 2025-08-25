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
        return new ethers.JsonRpcProvider(ContractAddressConfig.URL)
    },
    async getBalance() {
        const address = await this.getAddress()
        const provider = this.getProvider()
        if (address===null) return 0
        return await provider.getBalance(address)
    },
    async getSingle() {
        if (!localMaskUtil.isEmpty()) {
            return localMaskUtil.getSingle()
        }
        if (!await metaMaskUtil.isEmpty()) {
            return await metaMaskUtil.getSingle()
        }
        return null
    }
}

export default maskUtil