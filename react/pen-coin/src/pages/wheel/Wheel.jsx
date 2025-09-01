import style from './Wheel.module.scss'
import WheelDraw from "./WheelDraw.jsx";
import {GreenButton} from "../../components/Button.jsx";
import {useEffect, useRef, useState} from "react";
import DrawHistory from "./DrawHistory.jsx";
import Notice from "../../components/Notice.jsx";
import maskUtil from "../../utils/maskUtil.js";
import userStore from "../../store/userStore.js";
import {erc20DrawContractApi} from "../../api/erc20ContractApi.js";
import dateUtil from "../../utils/dateUtil.js";

function Wheel()
{
    const {login, playCount, setPlayCount} = userStore()
    const wheelRef = useRef(null);
    const [drawCount, setDrawCount] = useState(0)
    const [drawCost, setDrawCost] = useState("")

    const updateInfo = async () => {
        let useDrawCount = 0
        let useDrawCost = ""

        const address = await maskUtil.getAddress()
        if (address) {
            useDrawCount = 3n - await erc20DrawContractApi.getDrawCount(address)
            if (useDrawCount === 3n) useDrawCost = <>，本次抽奖 <mark>免费</mark></>
            if (useDrawCount === 2n) useDrawCost = <>，本次抽奖消耗 <mark>100</mark> pen</>
            if (useDrawCount === 1n) useDrawCost = <>，本次抽奖消耗 <mark>200</mark> pen</>
            const drawDateNumber = await erc20DrawContractApi.getDrawDate(address)
            if (drawDateNumber.toString() !== dateUtil.getTodayNumber().toString()) {
                useDrawCount = 3n
                useDrawCost = <>，本次抽奖 <mark>免费</mark></>
            }
        }

        setDrawCount(useDrawCount)
        setDrawCost(useDrawCost)
    }

    useEffect(() => {
        updateInfo().then()
    }, [login, playCount]);

    const handleDraw = async () => {
        if (wheelRef.current) {
            const prize = await wheelRef.current.luckyDraw();
            console.log("抽中的奖品:", prize)
            setPlayCount()

        }
    };

    return (
        <div-main className={style.Wheel}>
            <div className={style.Left}>
                <h1>幸运抽奖</h1>
                <h5>点击抽奖，获取随机代币奖励！！！</h5>
                <p>今日剩余 <mark>{drawCount.toString()}</mark> 次抽奖机会{drawCost}</p>
                <br></br>
                <br></br>
                <WheelDraw
                    ref={wheelRef}
                    n={6}
                    prizes={[
                    "100 pen", "感谢参与", "200 pen", "神秘token", "888 pen", "重置次数"
                    ]}
                    prizesSimple={
                        ["100 PEN", "nothing", "200 PEN", "token", "888 PEN", "reset"]
                    }
                >
                </WheelDraw>
                <div className={style.ButtonArea}>
                    <GreenButton clickHandle={handleDraw} name={"抽奖"}></GreenButton>
                </div>
            </div>
            <div className={style.Right}>
                <DrawHistory></DrawHistory>
                <div className={style.NoticeArea}>
                    <Notice textArr={[
                        "每个账户每天有3次抽奖机会（一般情况）<br>首次免费、第二次需消耗100SATS、第三次消耗200SATS",
                        "神秘Token为8位，由某一拥有代币账户的地址生成",
                    ]}></Notice>
                </div>
            </div>
        </div-main>
    )
}

export default Wheel