import style from './LogoutInfo.module.scss'
import Avatar from "react-avatar";
import userStore from "../../store/userStore.js";
import strUtil from "../../utils/strUtil.js";
import {useEffect, useState} from "react";
import {FullWindowController} from "../../containers/ScreenWindow.jsx";
import maskUtil from "../../utils/maskUtil.js";

const LogoutInfo = () => {

    const {address, setLogin} = userStore()
    const [copyText, setCopyText] = useState('复制')

    const logoutHandle = () => {
        console.log('logout')
        FullWindowController.close()
        maskUtil.logout()
        setLogin(false)
    }

    function copyAddress() {
        navigator.clipboard.writeText(address).then(() => {
            setCopyText('已复制');
            setTimeout(() => {
                setCopyText('复制');
            }, 2000); // 2 seconds
        });
    }

    return (
        <div-back className={style.LogoutInfo}>
            <div className={style.AvatarArea}>
                <Avatar name={strUtil.maskAddress(address)} size="80" round={true}></Avatar>
            </div>
            <div className={style.Balance}>
                <p>账户地址</p>
                <small onClick={copyAddress}>{copyText}</small>
                <strong>{address}</strong>
            </div>
            <br></br>
            <br></br>
            <p>PEN: <mark>1004.23234</mark></p>
            <p>PEN: <mark>1004.23234</mark></p>
            <p>PEN: <mark>1004.23234</mark></p>
            <button onClick={logoutHandle}>退出登录</button>
        </div-back>
    )
}

export default LogoutInfo