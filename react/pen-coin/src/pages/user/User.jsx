import style from './User.module.scss'
import LineChart from "../../components/LineChart.jsx";
import {GreenButton} from "../../components/Button.jsx";
import UserHistory from "./UserHistory.jsx";
import {useEffect, useState} from "react";
import userStore from "../../store/userStore.js";
import UserHandle from "./UserHandle.js";
import {GetUserInfo} from "../../api/userBackendApi.js";
import strUtil from "../../utils/strUtil.js";
import metaMaskUtil, {metamaskApi} from "../../utils/metaMaskUtil.js";

const User = () => {

    const {address} = userStore()
    const [type, setType] = useState("day")
    const [balanceHistory, setBalanceHistory] = useState([0,0])
    const [balance, setBalance] = useState(0)
    const [balanceChange, setBalanceChange] = useState(0.0)
    const [count, setCount] = useState(0)
    const [countChange, setCountChange] = useState(0.0)
    const [balanceUp, setBalanceUp] = useState(true)
    const [countUp, setCountUp] = useState(true)

    function calculateUseBalanceChange(todayBalance, yesterdayBalance) {
        const today = Number(todayBalance);
        const yesterday = Number(yesterdayBalance);
        const maxVal = Math.max(today, yesterday);
        if (maxVal === 0) return 0;
        return Math.abs(today - yesterday) * 100.0 / maxVal;
    }

    const updateInfo = async () => {
        let useBalanceHistory = []
        let useBalance = 0n
        let useCount = 0
        let useBalanceChange = 0.0
        let useCountChange = 0.0
        let useBalanceUp = true
        let useCountUp = true

        if (address) {
            useBalanceHistory = await UserHandle.getBalanceHistory(type)
            const info = (await GetUserInfo(address)).data
            console.log(info)
            useBalance = info.todayBalance
            useCount = info.todayCount
            useBalanceChange = calculateUseBalanceChange(info.todayBalance, info.yesterdayBalance)
            useCountChange = calculateUseBalanceChange(info.todayCount, info.yesterdayCount)
            useBalanceUp = info.todayBalance > info.yesterdayBalance
            useCountUp = info.todayCount > info.yesterdayCount
        }

        setBalanceHistory(useBalanceHistory)
        setBalance(useBalance)
        setBalanceChange(useBalanceChange)
        setCount(useCount)
        setCountChange(useCountChange)
        setBalanceUp(useBalanceUp)
        setCountUp(useCountUp)
    }

    useEffect(() => {
        updateInfo().then()
    }, [address])

    useEffect(() => {
        UserHandle.getBalanceHistory(type)
            .then((res) => {
                setBalanceHistory(res)
            })
    }, [type]);

    return (
        <div-main className={style.User}>
            <div className={style.Left}>
                <h1>个人中心</h1>
                <h5>查看个人账户与活动记录</h5>
                <div-back>
                    <p>代币资产</p>
                    <h2>{balance} PEN</h2>
                    <small>
                        相对于上周{balanceUp?'上升':'下降'}
                        <mark className={balanceUp ? style.Up : style.Down}>{balanceChange}%</mark>
                    </small>
                </div-back>
                &nbsp;
                <div-back>
                    <p>本周活动</p>
                    <h2>{count} 次</h2>
                    <small>相对于上周活跃度{countUp?'上升':'下降'}
                        <mark className={countUp ? style.Up : style.Down}>{countChange}%</mark>
                    </small>
                </div-back>
                <br></br><br></br>
                <LineChart arr={balanceHistory} updateInfo = {setType}></LineChart>
                <div className={style.ButtonAreaAdd}>
                    <GreenButton name={"添加到钱包"} clickHandle={metamaskApi.addTokenToMetaMask}></GreenButton>
                    <small>将pen代币添加到钱包中</small>
                </div>
                <div className={style.ButtonAreaRate}>
                    <GreenButton name={"查看排行榜"}></GreenButton>
                    <small>查看pen代币资产排行榜与活跃度排行榜</small>
                </div>
            </div>
            <div className={style.Right}>
                <UserHistory></UserHistory>
            </div>
        </div-main>
    )
}

export default User