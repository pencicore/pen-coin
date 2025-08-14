import style from './HomeGuide.module.scss'
import { useState } from 'react';
import {BlueButton, GreenButton} from "../components/Button.jsx";
import Notice from "../components/Notice.jsx";

function HomeGuide() {

    const [arrowMargin, setArrowMargin] = useState("25px");

    const receiveETH = () => {
        setArrowMargin("160px");
    }

    const receivePEN = () => {
        setArrowMargin("380px");
    }

    const noticeTextArr = [
        "所在以太坊网络环境为作者自己搭建的测试网络，该网络上的虚拟货币与代币<strong>不具备任何实际价值</strong>",
        "该项目为作者学习Web3相关知识后，学以致用的作品，<strong>不具备任何商业背景</strong>",
    ]

    return (
        <div className={style.HomeGuide}>
            <div className={style.ArrowArea}>
                <div className={style.Arrow} style={{marginTop: arrowMargin}}></div>
            </div>
            <div className={style.Left}>
                <br></br>
                <h1>第一步  登录</h1>
                <p>点击 <a>登录</a> 按钮，输入私钥或连接钱包登录</p>
                <br></br>
                <br></br>
                <br></br>
                <h1>第二步  领取水龙头</h1>
                <p>点击下方领取按钮，领取ETH测试币</p>
                <GreenButton name={"领取"} clickHandle={receiveETH}></GreenButton>
                <small>当前已领取：<strong>234.34753485 PEN</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前未领取：<strong>234.34753485 PEN</strong></small>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h1>第三步  领取代币水龙头</h1>
                <p>点击下方领取按钮，领取PEN代币</p>
                <BlueButton name={"领取"} clickHandle={receivePEN}>领取</BlueButton>
                <small>当前已领取：<strong>234.34753485 ETH</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前未领取：<strong>234.34753485 ETH</strong></small>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h1>第四步  开启PEN代币链游之旅</h1>
            </div>
            <div className={style.Right}>
                <div className={style.NoticeArea}>
                    <Notice textArr={noticeTextArr}></Notice>
                </div>
            </div>
        </div>
    )
}

export default HomeGuide;