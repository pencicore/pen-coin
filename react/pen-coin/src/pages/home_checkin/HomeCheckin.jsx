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

function HomeCheckin()
{
    const {playCount, setPlayCount, login} = userStore()
    const [checkinReward, setCheckinReward] = useState(0n)
    const [checkinStreak, setCheckinStreak] = useState(0)
    const [haveCheckin, setHaveCheckin] = useState(false)

    const updateInfo = async () => {
        let useHaveCheckin = false
        let useCheckinReward = 0n
        let useCheckinStreak = 0

        const address = maskUtil.getAddress()
        if (address) {
            const checkDay = await erc20ContractApi.checkinDate(address)
            const today = dateUtil.getTodayNumber()
            useHaveCheckin = today.toString() === checkDay.toString()
            useCheckinStreak = await erc20ContractApi.checkinStreak(address)
            useCheckinReward = await erc20ContractApi.getCheckinReward(useCheckinStreak)
        }

        setHaveCheckin(useHaveCheckin)
        setCheckinStreak(useCheckinStreak)
        setCheckinReward(useCheckinReward)
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
                <div-back>
                    <p>今日可获代币</p>
                    <h2>+ {checkinReward / (10n ** 18n)} PEN</h2>
                </div-back>
                <div-back>
                    <p>已连续签到</p>
                    <h2>{checkinStreak}天</h2>
                </div-back>
                <div-back>
                    <p>累计签到</p>
                    <h2>0天</h2>
                </div-back>
                <div-back className={style.LastCheckinInfo}>
                    <p>本周累计签到</p>
                    <h2>0天</h2>
                    <small>&nbsp;/ 7天</small>
                </div-back>
                <br></br>
                <br></br>
                <p>账户PEN代币余额网络排名 <mark>34</mark> 名</p>
                <br></br>
                <p>连续签到网络排名 <mark>34</mark> 名</p>
                <br></br>
                <p>累计签到网络排名 <mark>34</mark> 名</p>
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