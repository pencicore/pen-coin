import style from './AuctionPriceHistory.module.scss'
import {useEffect, useState} from "react";

const AuctionPriceHistory = () => {

    const [history, setHistory] = useState([])

    const updateHistory = () => {
        const temp = []
        for(let i=1;i<=6;i++) {
            temp.push(
                <tr>
                    <td style={{width: '260px'}}><p>2025/08/07 22:45:20</p></td>
                    <td style={{width: '170px'}}><p>5024 PEN</p></td>
                    <td style={{width: '120px'}}>
                        <p style={{color: 'rgba(252, 61, 57, 1)'}} >- 50 PEN</p>
                    </td>
                </tr>
            )
        }
        setHistory(temp)
    }

    useEffect(() => {
        updateHistory()
    }, []);

    return (
        <div-container className={style.AuctionPriceHistory}>
            <i></i>
            <p>&nbsp;&nbsp;价格变动记录</p>
            <table >{history}</table>
        </div-container>
    )
}

export default AuctionPriceHistory