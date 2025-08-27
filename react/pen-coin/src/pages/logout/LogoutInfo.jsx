import style from './LogoutInfo.module.scss'
import Avatar from "react-avatar";
import userStore from "../../store/userStore.js";
import strUtil from "../../utils/strUtil.js";
import {useEffect, useState} from "react";
import {FullWindowController} from "../../containers/ScreenWindow.jsx";
import maskUtil from "../../utils/maskUtil.js";

const LogoutInfo = () => {

    const {setLogin, ethCount, penCount, nftPenCount} = userStore()
    const [copyText, setCopyText] = useState('复制')
    const [address, setAddress] = useState("")

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

    useEffect(() => {
        maskUtil.getAddress().then(address => {
            setAddress(address)
        })
    }, []);

    return (
        <div-back className={style.LogoutInfo}>
            <div className={style.AvatarArea}>
                <Avatar name={strUtil.maskAddress(address)} size="80" textSizeRatio={"100px"} round={true}></Avatar>
            </div>
            <div className={style.Balance}>
                <p>
                    账户地址
                    <small onClick={copyAddress}>{copyText}</small>
                </p>
                <strong>{address}</strong>
            </div>
            <br></br>
            <br></br>
            <p>
                以太坊资产:
                <br></br>
                <mark>{strUtil.ethBalanceToString(ethCount)}</mark> ETH
            </p>
            <p>
                PEN代币资产:
                <br></br>
                <mark>{strUtil.ethBalanceToString(penCount)}</mark> PEN
            </p>
            <p>
                NFT token数量:
                <br></br>
                <mark>{nftPenCount}</mark> 个
            </p>
            <button onClick={logoutHandle}>退出登录</button>
        </div-back>
    )
}

export default LogoutInfo