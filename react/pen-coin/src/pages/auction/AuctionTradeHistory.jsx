import style from './AuctionTradeHistory.module.scss'
import {useEffect, useState} from "react";

const AuctionTradeHistory = () => {

    const [history, setHistory] = useState([])

    const updateHistory = () => {
        const temp = []
        for(let i=1;i<=5;i++) {
            temp.push(
                <div className={style.TradeItem}>
                    <img alt={i+''} src="https://img.js.design/assets/img/689998c8b5e8b987e5be2fb6.png#13a047cfd216f83a700595d35a320c2f"></img>
                    <span>Token：<mark>ABCDEFGH12345678</mark></span>
                    <span>Price：<mark>3000 PEN</mark></span>
                    <span>Buyer：<mark>ABCD**5678</mark></span>
                    <span>Time：<mark>2025/08/09 22:22:22</mark></span>
                </div>
            )
        }
        setHistory(temp)
    }

    useEffect(() => {
        updateHistory()
    }, []);

    return (
        <div-container className={style.AuctionTradeHistory}>
            <i></i>
            <p>&nbsp;&nbsp;成交记录</p>
            {history}
        </div-container>
    )
}

export default AuctionTradeHistory