import style from './TradeHistory.module.scss'
import {useEffect, useState} from "react";

const TradeHistory = () => {

    const [history, setHistory] = useState([])

    const updateHistory = () => {
        let temp = []
        for (let i=1;i<=10;i++) {
            temp.push(
                <tr className>
                    <td><p>0.00435 PEN/ETH</p></td>
                    <td><p>234.0023 PEN</p></td>
                    <td><small>2025/08/09 22:22:22</small></td>
                    <td><p className={style.Up}>ETH to PEN</p></td>
                </tr>
            )
        }
        setHistory(temp)
    }

    useEffect(() => {
        updateHistory()
    }, [])

    return (
        <div-container className={style.TradeHistory}>
            <i></i>
            <p>&nbsp;&nbsp;订单记录</p>
            <table>
                <thead>
                    <tr>
                        <th style={{width: '149px'}}>成交价格</th>
                        <th style={{width: '120px'}}>成交量</th>
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