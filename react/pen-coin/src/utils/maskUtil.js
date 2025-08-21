import {localMaskUtil} from './localMaskUtil';
import metaMaskUtil from "./metaMaskUtil.js";

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
    }
}

export default maskUtil