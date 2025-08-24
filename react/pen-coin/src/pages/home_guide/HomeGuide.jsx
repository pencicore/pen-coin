import style from './HomeGuide.module.scss'
import {useEffect, useState} from 'react';
import {MiniBlueButton, MiniGreenButton, MiniGreenButtonStop} from "../../components/Button.jsx";
import Notice from "../../components/Notice.jsx";
import {FullWindowController} from "../../containers/ScreenWindow.jsx";
import Login from "../login/Login.jsx";
import maskUtil from "../../utils/maskUtil.js";
import {AccountAddress, ContractAddressConfig} from "../../config/contractAddressConfig.js";
import strUtil from "../../utils/strUtil.js";
import {GetEthFaucet, GetHaveEthFaucet, GetReceiveBalance} from "../../api/faucetBackendApi.js";
import userStore from "../../store/userStore.js";
import toastUtil from "../../utils/toastUtil.js";
import erc20ContractApi from "../../api/erc20ContractApi.js";
import faucetContractApi from "../../api/faucetContractApi.js";

function HomeGuide() {

    const {address, login, setEthCount, setPenCount} = userStore()
    const [arrowMargin, setArrowMargin] = useState("25px");

    const [ETHReceived, setETHReceived] = useState(0)
    const [ETHBalance, setETHBalance] = useState(0)
    const [PENReceived, setPENReceived] = useState(0)
    const [PENBalance, setPENBalance] = useState(0)

    const [haveReceivedETH, setHaveReceivedETH] = useState(false)
    const [haveReceivedPEN, setHaveReceivedPEN] = useState(false)

    const updateInfo = async () => {
        let useAddress = address
        if (address === null) {
            useAddress = await maskUtil.getAddress()
        }

        const provide = maskUtil.getProvider()
        setETHBalance(await provide.getBalance(AccountAddress.ETHFaucetAccount))
        setETHReceived((await GetReceiveBalance()).data)

        setPENBalance(await erc20ContractApi.balanceOf(ContractAddressConfig.Faucet))

        const useHaveReceivedETH = (await GetHaveEthFaucet(useAddress)).data > 0
        setHaveReceivedETH(useHaveReceivedETH)
        const useHaveReceivedPEN = (await faucetContractApi.requestedAddress(useAddress))
        setHaveReceivedPEN(useHaveReceivedPEN)

        if (useHaveReceivedPEN) {
            setArrowMargin("600px");
        }
        else if (useHaveReceivedETH) {
            setArrowMargin("380px");
        }
        else if (useAddress!=null) {
            setArrowMargin("160px");
        }

        setEthCount((await maskUtil.getBalance()).toString())
        setPenCount((await erc20ContractApi.balanceOf(address)).toString())
    }

    useEffect(()=>{
        updateInfo().then()
    }, [login])

    const receiveETH = async () => {
        const res = await GetEthFaucet(address)
        if(res.code === 0) {
            updateInfo().then()
            toastUtil.log("领取成功")
        }
    }

    const receivePEN = async () => {
        const res = await faucetContractApi.requestTokens()
        if(res) {
            updateInfo().then()
            toastUtil.log("领取成功")
        }
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
                    {!login && <a onClick={()=>{FullWindowController.open(<Login></Login>)}}> 登录 </a>}
                    {login && <a> 登录 </a>}
                    按钮，输入私钥或连接钱包登录
                </p>
                <br></br>
                <br></br>
                <br></br>
                <h3>第二步  领取水龙头</h3>
                <p>点击下方领取按钮，领取ETH测试币</p>
                {!haveReceivedETH && <MiniGreenButton name={"领取"} clickHandle={receiveETH}></MiniGreenButton>}
                {haveReceivedETH && <MiniGreenButtonStop name={"已领取"}></MiniGreenButtonStop>}
                <small>
                    当前已领取：
                    <mark>{strUtil.ethStringToString(ETHReceived)} ETH</mark>
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
                {!haveReceivedPEN && <MiniGreenButton name={"领取"} clickHandle={receivePEN}></MiniGreenButton>}
                {haveReceivedPEN && <MiniGreenButtonStop name={"已领取"}></MiniGreenButtonStop>}
                <small>
                    当前已领取：
                    <mark>{PENReceived} PEN</mark>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    当前未领取：
                    <mark>{strUtil.ethBalanceToString(PENBalance)} PEN</mark>
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