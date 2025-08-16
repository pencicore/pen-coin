import style from './Wheel.module.scss'
import WheelDraw from "./WheelDraw.jsx";
import {GreenButton} from "../../components/Button.jsx";
import {useRef} from "react";

function Wheel()
{
    const wheelRef = useRef(null);

    const handleDraw = async () => {
        if (wheelRef.current) {
            const prize = await wheelRef.current.luckyDraw();
            // alert(`抽中的奖品:${prize}`);
            console.log("抽中的奖品:", prize)
        }
    };

    return (
        <div-main className={style.Wheel}>
            <div className={style.Left}>
                <h1>幸运抽奖</h1>
                <h5>点击抽奖，获取随机代币奖励！！！</h5>
                <p>今日剩余 <mark>3</mark> 次抽奖机会，本次抽奖 <mark>免费</mark></p>
                <br></br>
                <br></br>
                <WheelDraw
                    ref={wheelRef}
                    n={6}
                    prizes={[
                    "100 pen",
                    "感谢参与",
                    "200 pen",
                    "神秘token",
                    "888 pen",
                    "再来两次"
                    ]}
                >
                </WheelDraw>
                <div className={style.ButtonArea}>
                    <GreenButton clickHandle={handleDraw}>抽奖</GreenButton>
                </div>
            </div>
            {/*<div className={style.Right}></div>*/}
        </div-main>
    )
}

export default Wheel