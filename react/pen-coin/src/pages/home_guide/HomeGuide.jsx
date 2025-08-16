import style from './HomeGuide.module.scss'
import { useState } from 'react';
import {MiniBlueButton, MiniGreenButton} from "../../components/Button.jsx";
import Notice from "../../components/Notice.jsx";

function HomeGuide() {

    const [arrowMargin, setArrowMargin] = useState("25px");

    const receiveETH = () => {
        setArrowMargin("160px");
    }

    const receivePEN = () => {
        setArrowMargin("380px");
    }

    return (
        <div className={style.HomeGuide}>
            <div className={style.ArrowArea}>
                <div className={style.Arrow} style={{marginTop: arrowMargin}}></div>
            </div>
            <div className={style.Left}>
                <br></br>
                <h3>第一步  登录</h3>
                <p>点击 <a>登录</a> 按钮，输入私钥或连接钱包登录</p>
                <br></br>
                <br></br>
                <br></br>
                <h3>第二步  领取水龙头</h3>
                <p>点击下方领取按钮，领取ETH测试币</p>
                <MiniGreenButton name={"领取"} clickHandle={receiveETH}></MiniGreenButton>
                <small>
                    当前已领取：
                    <mark>234.34753485 PEN</mark>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    当前未领取：
                    <mark>234.34753485 PEN</mark>
                </small>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h3>第三步  领取代币水龙头</h3>
                <p>点击下方领取按钮，领取PEN代币</p>
                <MiniBlueButton name={"领取"} clickHandle={receivePEN}>领取</MiniBlueButton>
                <small>
                    当前已领取：
                    <mark>234.34753485 ETH</mark>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    当前未领取：
                    <mark>234.34753485 ETH</mark>
                </small>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h3>第四步  开启PEN代币链游之旅</h3>
            </div>
            <div className={style.Right}>
                <div className={style.NoticeArea}>
                    <Notice textArr={[
                        "所在以太坊网络环境为作者自己搭建的测试网络，该网络上的虚拟货币与代币<mark>不具备任何实际价值</mark>",
                        "该项目为作者学习Web3相关知识后，学以致用的作品，<mark>不具备任何商业背景</mark>",
                    ]}></Notice>
                </div>
            </div>
        </div>
    )
}

export default HomeGuide;