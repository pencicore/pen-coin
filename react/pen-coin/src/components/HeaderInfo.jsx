import style from './HeaderInfo.module.scss'
import Avatar from "react-avatar";
import {useEffect, useState} from "react";
import userStore from "../store/userStore.js";
import strUtil from "../utils/strUtil.js";
import {useLocation} from "react-router-dom";
import ammContractApi from "../api/ammContractApi.js";
import {ethers} from "ethers";

const HeaderInfo = ({handleClick}) => {
    const {penCount, ethCount, address, playCount} = userStore()
    const location = useLocation(); // 新增
    const [showETH, setShowETH] = useState(true)
    const [showPEN, setShowPEN] = useState(true)
    const [showPricePEN, setShowPricePEN] = useState(true)
    const [copyText, setCopyText] = useState('复制')

    const [pricePEN, setPricePEN] = useState(0.0)
    const [priceETH, setPriceETH] = useState(0.0)

    function copyAddress() {
        navigator.clipboard.writeText(address).then(() => {
            setCopyText('已复制');
            setTimeout(() => {
                setCopyText('复制');
            }, 2000); // 2 seconds
        });
    }

    useEffect(() => {
        if (location.pathname === '/trade') {
            ammContractApi.getPENPriceInETH().then(price => {
                setPricePEN(ethers.formatUnits(price, 18))
            })
            ammContractApi.getETHPriceInPEN().then(price => {
                setPriceETH(ethers.formatUnits(price, 18))
            })
        }
    }, [address, playCount]);

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
                <h4>{showETH ? strUtil.ethBalanceToString(ethCount) : '********'} ETH</h4>
            </div>
            <div className={style.Balance}>
                <p>PEN代币余额</p>
                <small onClick={() => setShowPEN(!showPEN)}>{showPEN ? '显示' : '隐藏'}</small>
                <h4>{showPEN ? strUtil.ethBalanceToString(penCount) : '********'} PEN</h4>
            </div>
            {location.pathname === '/trade' && (
                <div className={style.Balance}>
                    <p>PEN代币价格</p>
                    <small onClick={() => setShowPricePEN(!showPricePEN)}>切换</small>
                    <h4>{showPricePEN ? pricePEN : priceETH} {showPricePEN ? 'ETH/PEN' : 'PEN/ETH'}</h4>
                </div>
            )}
        </div>
    )
}

export default HeaderInfo