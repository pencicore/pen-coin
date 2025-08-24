import style from './LoginMask.module.scss'
import {MiniGreenButton} from "../../components/Button.jsx";
import {useEffect, useState} from "react";
import metaMaskUtil, {metamaskApi} from "../../utils/metaMaskUtil.js";
import userStore from "../../store/userStore.js";
import {FullWindowController} from "../../containers/ScreenWindow.jsx";
import toastUtil from "../../utils/toastUtil.js";

const LoginMask = () => {

    const [text, setText] = useState('')
    const {setLogin} = userStore()

    useEffect(()=> {
        if (metamaskApi.checkMetamask()){
            setText("检测到已安装钱包")
        }
        else {
            setText("未检测到钱包")
        }
    }, [])

    const connectMetamask = async () => {
        if (!metamaskApi.checkMetamask()) {
            return
        }
        await metaMaskUtil.login()
        setLogin(true)
        FullWindowController.close()
        toastUtil.log("登录成功")
    }

    return (
        <div className={style.LoginMask}>
            <div className={style.MaskSvg}></div>
            <p>{text}</p>
            <MiniGreenButton name={"连接"} clickHandle={connectMetamask}></MiniGreenButton>
        </div>
    )
}

export default LoginMask