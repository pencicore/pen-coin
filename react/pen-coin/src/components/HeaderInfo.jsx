import style from './HeaderInfo.module.scss'
import Avatar from "react-avatar";
import {useState} from "react";
import userStore from "../store/userStore.js";
import strUtil from "../utils/strUtil.js";

const HeaderInfo = ({handleClick}) => {
    const {penCount, ethCount, address} = userStore()
    const [showETH, setShowETH] = useState(false)
    const [showPEN, setShowPEN] = useState(false)
    const [copyText, setCopyText] = useState('复制')

    function copyAddress() {
        navigator.clipboard.writeText(address).then(() => {
            setCopyText('已复制');
            setTimeout(() => {
                setCopyText('复制');
            }, 2000); // 2 seconds
        });
    }

    return (
        <div className={style.HeaderInfo}>
            <div className={style.AvatarArea} onClick={handleClick}>
                <Avatar name={strUtil.maskAddress(address)} size="48" round={true} />
            </div>
            <div className={style.Balance}>
                <p>账户地址</p>
                <small onClick={copyAddress}>{copyText}</small>
                <h4>{strUtil.maskAddress(address)}</h4>
            </div>
            <div className={style.Balance}>
                <p>以太坊账户余额</p>
                <small onClick={() => setShowETH(!showETH)}>{showETH ? '显示' : '隐藏'}</small>
                <h4>{showETH ? ethCount : '********'} ETH</h4>
            </div>
            <div className={style.Balance}>
                <p>PEN代币余额</p>
                <small onClick={() => setShowPEN(!showPEN)}>{showPEN ? '显示' : '隐藏'}</small>
                <h4>{showPEN ? penCount : '********'} PEN</h4>
            </div>
        </div>
    )
}

export default HeaderInfo