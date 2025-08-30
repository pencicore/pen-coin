import style from './UserHistory.module.scss'
import {useEffect, useState} from "react";
import userStore from "../../store/userStore.js";
import {PageEventHistory} from "../../api/userBackendApi.js";
import strUtil from "../../utils/strUtil.js";

function UserHistory() {

    const {address, playCount} = userStore()
    const [history, setHistory] = useState([])
    const [historyData, setHistoryData] = useState([])

    const updateHistory = () => {
        let temp = []
        for (let i = 0; i < historyData.length; i++) {
            const amount = Number(historyData[i].Amount)
            temp.push(
                <tr>
                    <td style={{width: '160px'}}><p>{historyData[i].EventCnName}</p></td>
                    <td style={{width: '140px'}}><p className={amount>0 ? style.Up : style.Down}>
                        {amount>0 ? '+' : '-'} {Math.abs(amount).toPrecision(6)} PEN
                    </p></td>
                    <td style={{width: '156px'}}>
                        <small>{strUtil.dateTimeToString(historyData[i].CreatedAt)}</small>
                    </td>
                </tr>
            )
        }
        setHistory(temp)
    }

    useEffect(() => {
        updateHistory()
    }, [historyData]);

    const updateInfo = async () => {
        let useHistoryData = []
        if (address) {
            useHistoryData =(await PageEventHistory(address, 1, 9)).data.list
        }
        setHistoryData(useHistoryData)
    }

    useEffect(() => {
        updateInfo().then()
    }, [address, playCount]);

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