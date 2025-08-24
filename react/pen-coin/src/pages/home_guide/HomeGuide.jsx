import style from './HomeGuide.module.scss'
import {useEffect, useState} from 'react';
import {MiniBlueButton, MiniGreenButton} from "../../components/Button.jsx";
import Notice from "../../components/Notice.jsx";
import {FullWindowController} from "../../containers/ScreenWindow.jsx";
import Login from "../login/Login.jsx";
import maskUtil from "../../utils/maskUtil.js";
import {AccountAddress} from "../../config/contractAddressConfig.js";
import strUtil from "../../utils/strUtil.js";
import {GetEthFaucet, GetReceiveBalance} from "../../api/faucetBackendApi.js";
import userStore from "../../store/userStore.js";

function HomeGuide() {

    const {address} = userStore()
    const [arrowMargin, setArrowMargin] = useState("25px");

    const receiveETH = () => {
        setArrowMargin("160px");
    }

    const receivePEN = () => {
        setArrowMargin("380px");
    }

    const [ETHReceived, setETHReceived] = useState(0)
    const [ETHBalance, setETHBalance] = useState(0)
    const [PENReceived, setPENReceived] = useState(0)
    const [PENBalance, setPENBalance] = useState(0)

    useEffect(()=>{
        const fun = async () => {
            const provide = maskUtil.getProvider()
            setETHBalance(await provide.getBalance(AccountAddress.ETHFaucetAccount))
            setETHReceived((await GetReceiveBalance()).data)
        }
        fun().then()
    }, [])

    const ETHFaucet = async () => {
        const res = await GetEthFaucet(address)
        console.log(res)
        receivePEN()
    }

    return (
        <div className={style.HomeGuide}>
            <div className={style.ArrowArea}>
                <div className={style.Arrow} style={{marginTop: arrowMargin}}></div>
            </div>
            <div className={style.Left}>
                <br></br>
                <h3>第一步  登录</h3>
                <p>点击
                    <a onClick={()=>{FullWindowController.open(<Login></Login>)}}> 登录 </a>
                    按钮，输入私钥或连接钱包登录
                </p>
                <br></br>
                <br></br>
                <br></br>
                <h3>第二步  领取水龙头</h3>
                <p>点击下方领取按钮，领取ETH测试币</p>
                <MiniGreenButton name={"领取"} clickHandle={ETHFaucet}></MiniGreenButton>
                <small>
                    当前已领取：
                    <mark>{strUtil.ethBalanceToString(ETHReceived)} ETH</mark>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    当前未领取：
                    <mark>{strUtil.ethBalanceToString(ETHBalance)} ETH</mark>
                </small>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h3>第三步  领取代币水龙头</h3>
                <p>点击下方领取按钮，领取PEN代币</p>
                <MiniBlueButton name={"领取"} clickHandle={ETHFaucet}>领取</MiniBlueButton>
                <small>
                    当前已领取：
                    <mark>{PENReceived} PEN</mark>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    当前未领取：
                    <mark>{PENBalance} PEN</mark>
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