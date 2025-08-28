import style from './User.module.scss'
import LineChart from "../../components/LineChart.jsx";
import {GreenButton} from "../../components/Button.jsx";
import UserHistory from "./UserHistory.jsx";
import {useEffect, useState} from "react";
import userStore from "../../store/userStore.js";
import UserHandle from "./UserHandle.js";

const User = () => {

    const {address} = userStore()
    const [type, setType] = useState("day")
    const [balanceHistory, setBalanceHistory] = useState([0,0])

    const updateInfo = async () => {
        let useBalanceHistory = []

        if (address) {
            useBalanceHistory = await UserHandle.getBalanceHistory(type)
        }

        setBalanceHistory(useBalanceHistory)
    }

    useEffect(() => {
        updateInfo().then()
    }, [address])

    useEffect(() => {
        UserHandle.getBalanceHistory(type)
            .then((res) => {
                setBalanceHistory(res)
                console.log(res)
            })
    }, [type]);

    return (
        <div-main className={style.User}>
            <div className={style.Left}>
                <h1>个人中心</h1>
                <h5>查看个人账户与活动记录</h5>
                <div-back>
                    <p>代币资产</p>
                    <h2>3456.6879 PEN</h2>
                    <small>相对于上周下降 <mark className={style.Down}>20.4%</mark> </small>
                </div-back>
                &nbsp;
                <div-back>
                    <p>本周活动</p>
                    <h2>223 次</h2>
                    <small>相对于上周活跃度上升   <mark className={style.Up}>2.0%</mark> </small>
                </div-back>
                <br></br><br></br>
                <LineChart arr={balanceHistory} updateInfo = {setType}></LineChart>
                <div className={style.ButtonAreaAdd}>
                    <GreenButton name={"添加到钱包"}></GreenButton>
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