import style from './NftTradeHistory.module.scss'
import {useEffect, useState} from "react";

function NftTradeHistory() {

    const [orders, setOrders] = useState([])

    const updateOrders = () => {
        const temp = []
        for(let i=1;i<=5;i++) {
            temp.push(
                <div className={style.Order}>
                    <img alt="order" src={"https://img.js.design/assets/img/689998c8b5e8b987e5be2fb6.png#13a047cfd216f83a700595d35a320c2f"}></img>
                    <small>Token：<mark>ABCDEFGH12345678</mark></small>
                    <small>Time：<mark>2025/08/09 22:22:22</mark></small>
                    <small>Buyer：<mark>ABCD**5678</mark></small>
                    <small>Seller：<mark>CDSA**5734</mark></small>
                </div>
            )
        }
        setOrders(temp)
    }

    useEffect(() => {
        updateOrders()
    }, []);

    return (
        <div-container className={style.NftTradeHistory}>
            <i></i>
            <p>&nbsp;&nbsp;成交记录</p>
            {orders}
        </div-container>
    )
}

export default NftTradeHistory