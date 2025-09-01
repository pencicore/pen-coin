import style from './NftInfoHistory.module.scss'
import {useEffect, useState} from "react";
import Avatar from "react-avatar";
import strUtil from "../../utils/strUtil.js";
import tradeStore from "../../store/tradeStore.js";

function NftInfoHistory({historyList}) {

    const {pricePEN, priceETH} = tradeStore()
    const [history, setHistory] = useState([])

    useEffect(() => {
        updateHistory(historyList)
        console.log(priceETH, pricePEN)
    }, [historyList]);

    const updateHistory = (historyList) => {
        let temp = []
        for(let i=0;i<historyList.length;i++) {
            const item = historyList[i]
            temp.push(
                <tr key={i} className={style.TradeItem}>
                    <td style={{width: '90px'}}>{
                        <>
                            <p className={style.TextFirst}>{item.CreatedAt.slice(0,10)}</p>
                            <p className={style.TextSecond}>{item.CreatedAt.slice(11,16)}</p>
                        </>
                    }</td>
                    <td style={{width: '85px'}}>
                        <p className={style.Type}>{item.TradeType}</p>
                    </td>
                    <td style={{width: '125px'}}>
                        <>
                            <div className={style.Avatar}>
                                <Avatar name={strUtil.maskAddress(item.FromAddress)} size="20" round={true}></Avatar>
                            </div>
                            <p className={style.Address}>{strUtil.maskAddress(item.FromAddress)}</p>
                        </>
                    </td>
                    <td style={{width: '125px'}}>
                        <>
                            <div className={style.Avatar}>
                                <Avatar name={strUtil.maskAddress(item.ToAddress)} size="20" round={true}></Avatar>
                            </div>
                            <p className={style.Address}>{strUtil.maskAddress(item.ToAddress)}</p>
                        </>
                    </td>
                    <td style={{width: '90px'}}>
                        <>
                            <p className={style.TextFirst}>{item.Amount} PEN</p>
                            <p className={style.TextSecond}>{item.Amount * (pricePEN/priceETH)} ETH</p>
                        </>
                    </td>
                </tr>
            )
        }
        setHistory(temp)
    }

    return (
        <div-container className = {style.NftInfoHistory}>
            <i></i>
            <p>NFT历史记录</p>
            <table className={style.Table}>
                <thead>
                <tr>
                    <th style={{width: '90px'}}>日期</th>
                    <th style={{width: '85px'}}>获取方式</th>
                    <th style={{width: '125px'}}>发送地址</th>
                    <th style={{width: '125px'}}>接收地址</th>
                    <th style={{width: '90px'}}>成交价格</th>
                </tr>
                </thead>
                <tbody className={style.HistoryTbody}>
                {history}
                </tbody>
            </table>
        </div-container>
    )
}

export default NftInfoHistory