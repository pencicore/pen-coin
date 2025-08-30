import style from './TradeHistory.module.scss'
import {useEffect, useState} from "react";
import userStore from "../../store/userStore.js";
import {PageSwapHistory} from "../../api/swapBackendApi.js";
import strUtil from "../../utils/strUtil.js";

const TradeHistory = () => {

    const {address, playCount} = userStore()
    const [history, setHistory] = useState([])
    const [historyData, setHistoryData] = useState([])

    const updateHistory = () => {
        let temp = []
        for (let i=0;i<historyData.length;i++) {
            const item = historyData[i]
            const price = item.TokenIn === 'PEN' ? Number(item.AmountOut)/Number(item.AmountIn)  : Number(item.AmountIn)/Number(item.AmountOut)
            const amount = Number(item.TokenIn === 'PEN' ? item.AmountIn : item.AmountOut)
            temp.push(
                <tr key={i}>
                    <td><p>{price.toPrecision(6)} ETH/PEN</p></td>
                    <td><p>{amount.toPrecision(6)} PEN</p></td>
                    <td><small>{strUtil.dateTimeToString(item.CreatedAt)}</small></td>
                    <td><p className={item.TokenIn==='PEN' ? style.Up : style.Down}>{item.TokenIn + " to "+ item.TokenOut}</p></td>
                </tr>
            )
        }
        setHistory(temp)
    }

    useEffect(() => {
        updateHistory()
    }, [historyData])

    const updateInfo = async () => {
        let useHistoryData = []

        if (address) {
            useHistoryData = (await PageSwapHistory(1, 10)).data.list
        }

        setHistoryData(useHistoryData)
    }

    useEffect(() => {
        updateInfo().then()
    }, [address, playCount]);

    return (
        <div-container className={style.TradeHistory}>
            <i></i>
            <p>&nbsp;&nbsp;订单记录</p>
            <table>
                <thead>
                    <tr>
                        <th style={{width: '159px'}}>成交价格</th>
                        <th style={{width: '110px'}}>成交量</th>
                        <th style={{width: '157px'}}>成交时间 </th>
                        <th style={{width: '98px'}}>方向</th>
                    </tr>
                    {history}
                </thead>
            </table>
        </div-container>
    )
}

export default TradeHistory