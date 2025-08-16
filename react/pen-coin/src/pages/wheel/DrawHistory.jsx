import style from './DrawHistory.module.scss'
import {useEffect, useState} from "react";

function DrawHistory()
{
    const [history, setHistory] = useState([])

    const updateHistory = () => {
        const temp = []
        for(let i=1;i<10;i++) {
            temp.push(
                <tr>
                   <td style={{width: '175px'}}><p>FOOD**DFGH</p></td>
                    <td style={{width: '135px'}}><p>100 PEN</p></td>
                    <td style={{width: '200px'}}>
                        <p style={{color: 'rgba(144, 147, 153, 1)'}} >2025/08/07 22:45:20</p>
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
        <div-container className={style.DrawHistory}>
            <i></i>
            <p>&nbsp;&nbsp;最近中奖内容</p>
            <table style={{marginTop: '10px'}}>{history}</table>
        </div-container>
    )
}

export default DrawHistory