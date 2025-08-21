import {localMaskUtil} from "./localMaskUtil.js";
import metamaskApi from "../api/metamaskApi.js";

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
    }
 }

 export default metaMaskUtil