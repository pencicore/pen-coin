import style from './UserHistory.module.scss'
import {useEffect, useState} from "react";

function UserHistory() {

    const [history, setHistory] = useState([])

    const updateHistory = () => {
        let temp = []
        for (let i = 1; i <= 10; i++) {
            temp.push(
                <tr>
                    <td style={{width: '212px'}}><p>普通签到</p></td>
                    <td style={{width: '98px'}}><p className={style.Up}>+ 100 PEN</p></td>
                    <td style={{width: '156px'}}>
                        <small> 2025/08/07 22:45:20</small>
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
    <div-container className={style.UserHistory}>
        <i></i>
        <p>&nbsp;&nbsp;活动记录</p>
        <table>
            <tbody>
                {history}
            </tbody>
        </table>
    </div-container>
  )
}

export default UserHistory