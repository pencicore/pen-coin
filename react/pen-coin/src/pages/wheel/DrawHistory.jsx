import style from './DrawHistory.module.scss'
import {useEffect, useState} from "react";
import userStore from "../../store/userStore.js";
import maskUtil from "../../utils/maskUtil.js";
import {PageDrawHistory} from "../../api/drawBackendApi.js";
import strUtil from "../../utils/strUtil.js";

function DrawHistory()
{
    const {login, playCount} = userStore()
    const [historyPage, setHistoryPage] = useState([])
    const [history, setHistory] = useState([])

    const updateInfo = async () => {
        let useHistoryPage = []

        const address = await maskUtil.getAddress()
        if (address) {
            useHistoryPage = (await PageDrawHistory(1, 9)).data.list
        }

        setHistoryPage(useHistoryPage)
    }

    useEffect(() => {
        updateInfo().then()
    }, [login, playCount]);

    const updateHistory = () => {
        const temp = []
        const n = historyPage.length
        for(let i=0;i<n;i++) {
            const address = historyPage[i].Address
            const reward = historyPage[i].Reward
            const time = historyPage[i].CreatedAt
            temp.push(
                <tr key={i}>
                    <td style={{width: '175px'}}><p>{strUtil.maskAddress(address)}</p></td>
                    <td style={{width: '135px'}}><p>{reward}</p></td>
                    <td style={{width: '200px'}}>
                        <p style={{color: 'rgba(144, 147, 153, 1)'}} >{strUtil.dateTimeToString(time)}</p>
                    </td>
                </tr>
            )
        }
        setHistory(temp)
    }

    useEffect(() => {
        updateHistory()
    }, [historyPage])

    return (
        <div-container className={style.DrawHistory}>
            <i></i>
            <p>&nbsp;&nbsp;最近中奖内容</p>
            <table style={{marginTop: '10px'}}>
                <tbody>
                    {history}
                </tbody>
            </table>
        </div-container>
    )
}

export default DrawHistory