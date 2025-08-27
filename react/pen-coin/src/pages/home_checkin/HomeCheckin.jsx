import style from "./HomeCheckin.module.scss"
import Notice from "../../components/Notice.jsx";
import {GreenButton, GreenButtonStop} from "../../components/Button.jsx";
import CheckinCalendar from "./CheckinCalendar.jsx";
import {useEffect, useState} from "react";
import userStore from "../../store/userStore.js";
import erc20ContractApi from "../../api/erc20ContractApi.js";
import maskUtil from "../../utils/maskUtil.js";
import dateUtil from "../../utils/dateUtil.js";
import toastUtil from "../../utils/toastUtil.js";
import {
    GetCheckinCount,
    GetCheckinInfo,
    GetCheckinReward,
    GetMonthCheckin,
    GetMonthCheckinCount
} from "../../api/erc20BackendApi.js";

function HomeCheckin()
{
    const {playCount, setPlayCount, login} = userStore()
    const [checkinReward, setCheckinReward] = useState(0n)
    const [checkinStreak, setCheckinStreak] = useState(0)
    const [haveCheckin, setHaveCheckin] = useState(false)
    const [checkinCount, setCheckinCount] = useState(0)
    const [checkinMonthCount, setCheckinMonthCount] = useState(0)
    const [netMonthCount, setNetMonthCount] = useState(0)
    const [netTodayCount, setNetTodayCount] = useState(0)
    const [netAllCount, setNetAllCount] = useState(0)

    const updateInfo = async () => {
        let useHaveCheckin = false
        let useCheckinReward = 0n
        let useCheckinStreak = 0
        let useCheckinCount = 0
        let useCheckinMonthCount = 0
        let useNetMonthCount = 0
        let useNetTodayCount = 0
        let useAllCount = 0

        const address =await maskUtil.getAddress()
        if (address) {
            const checkDay = await erc20ContractApi.checkinDate(address)
            const today = dateUtil.getTodayNumber()
            useHaveCheckin = today.toString() === checkDay.toString()
            useCheckinStreak = await erc20ContractApi.checkinStreak(address)
            if(!useHaveCheckin) useCheckinReward = (await erc20ContractApi.getCheckinReward(useCheckinStreak)) / (10n ** 18n)
            else useCheckinReward = (await GetCheckinReward(address)).data
            useCheckinMonthCount = (await GetMonthCheckinCount(address, dateUtil.getCurrentYear(), dateUtil.getCurrentMonth())).data
            useCheckinCount = (await GetCheckinCount(address)).data
            const data = (await GetCheckinInfo()).data
            useNetTodayCount = data.today
            useNetMonthCount = data.month
            useAllCount = data.all
        }

        setHaveCheckin(useHaveCheckin)
        setCheckinStreak(useCheckinStreak)
        setCheckinReward(useCheckinReward)
        setCheckinCount(useCheckinCount)
        setCheckinMonthCount(useCheckinMonthCount)
        setNetTodayCount(useNetTodayCount)
        setNetMonthCount(useNetMonthCount)
        setNetAllCount(useAllCount)
    }

    const checkinHandle = async () => {
        setHaveCheckin(true)
        let res = await erc20ContractApi.checkin()
        if (res) {
            toastUtil.log(`签到成功，获取${res}PEN`)
        }
        setPlayCount()
    }

    useEffect(() => {
        updateInfo().then()
    }, [playCount, login]);

    return (
        <div className={style.HomeCheckin}>
            <div className={style.Left}>
                <h1>今日签到</h1>
                <h5>点击签到，领取PEN代币！！！</h5>
                {!haveCheckin &&
                    <div-back>
                        <p>今日可获代币</p>
                        <h2>+ {checkinReward} PEN</h2>
                    </div-back>}
                {haveCheckin &&
                    <div-back>
                        <p>今日已获代币</p>
                        <h2>+ {checkinReward} PEN</h2>
                    </div-back>}
                <div-back>
                    <p>已连续签到</p>
                    <h2>{checkinStreak}天</h2>
                </div-back>
                <div-back>
                    <p>累计签到</p>
                    <h2>{checkinCount}天</h2>
                </div-back>
                <div-back className={style.LastCheckinInfo}>
                    <p>本月累计签到</p>
                    <h2>{checkinMonthCount}天</h2>
                </div-back>
                <br></br>
                <br></br>
                <p>今日玩家打卡 <mark> {netTodayCount} </mark> 次</p>
                <br></br>
                <p>本月玩家打卡 <mark> {netMonthCount} </mark> 次</p>
                <br></br>
                <p>累计玩家打卡 <mark> {netAllCount} </mark> 次</p>
                <div className={style.NoticeArea}>
                    <Notice textArr={[
                        "首次签到，签到获得代币奖励 <mark>X10</mark>",
                        "周末签到，签到获得代币奖励 <mark>X2</mark> ",
                        "连续签到五天，签到获得代币奖励 <mark>X2</mark> ",
                        "每日签到刷新时间，以<mark>东八区</mark>为准(UCT +8) ",
                        "翻倍奖励可以<mark>叠加</mark>，但不会相乘。例如:<br/>" +
                        "首次签到且在周末，可获得11倍签到奖励；连续签到五天且在周末，可获得3倍签到奖励 ",
                    ]}></Notice>
                </div>
                <div className={style.ButtonArea}>
                    {!haveCheckin && <GreenButton name={"立即签到"} clickHandle={async () => await checkinHandle()}></GreenButton>}
                    {haveCheckin && <GreenButtonStop name={"已签到"}></GreenButtonStop>}
                </div>
            </div>
            <div className={style.Right}>
                <CheckinCalendar></CheckinCalendar>
            </div>
        </div>
    )
}

export default HomeCheckin