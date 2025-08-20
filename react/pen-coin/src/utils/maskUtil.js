import {localMaskUtil} from './localMaskUtil';

const maskUtil = {
    isEmpty() {
        return localMaskUtil.isEmpty()
    },
    getAddress() {
        if (!localMaskUtil.isEmpty()) {
            return localMaskUtil.getAddressHandle()
        }
        return null
    },
    logout() {
        localMaskUtil.logout()
    }
}

export default maskUtil