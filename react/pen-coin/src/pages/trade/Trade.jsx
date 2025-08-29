import style from './Trade.module.scss'
import {GreenButton} from "../../components/Button.jsx";
import LineChart from "../../components/LineChart.jsx";
import TradeHistory from "./TradeHistory.jsx";
import {useState} from "react";
import tradeStore from "../../store/tradeStore.js";
import userStore from "../../store/userStore.js";
import {ethers} from "ethers";
import ammContractApi from "../../api/ammContractApi.js";
import toastUtil from "../../utils/toastUtil.js";

function Trade() {

    const {pricePEN, priceETH} = tradeStore()
    const {penCount, ethCount, playCount, setPlayCount} = userStore()
    const [penToEth, setPenToEth] = useState(true)
    const [inputAmount, setInputAmount] = useState("")
    const [outputAmount, setOutputAmount] = useState("")

    function handleInputChange(value) {
        if (!value || isNaN(value)) {
            setOutputAmount("");
            setInputAmount("")
            return;
        }
        setInputAmount(value);
        const num = parseFloat(value);
        if (penToEth) {
            setOutputAmount((num * pricePEN).toFixed(6));
        } else {
            setOutputAmount((num * priceETH).toFixed(6));
        }
    }

    function handleOutputChange(value) {
        if (!value || isNaN(value)) {
            setOutputAmount("");
            setInputAmount("")
            return;
        }
        setOutputAmount(value);
        const num = parseFloat(value);
        if (penToEth) {
            setInputAmount((num / pricePEN).toFixed(6));
        } else {
            setInputAmount((num / priceETH).toFixed(6));
        }
    }

    async function swapHandler() {
        let value = 0
        if (inputAmount < 1.0) {
           value = BigInt(inputAmount * 10 ** 9) * 10n ** 9n
        }
        else {
            value = BigInt(inputAmount) * 10n ** 18n
        }
        console.log(value)
        if (penToEth) {
            await ammContractApi.swapPENForETH(value)
        }
        else {
            await ammContractApi.swapETHForPEN(value)
        }
        setInputAmount("")
        setOutputAmount("")
        setPlayCount()
        toastUtil.log("交易成功")
    }

    return (
        <div-main className={style.Trade}>
            <div className={style.Left}>
                <h1>代币交易</h1>
                <h5>PEN-ETH币币交易</h5>
                <div-back>
                    <p>从</p>
                    <h4>{penToEth ? "PEN 代币" : "ETH 资产"}</h4>
                </div-back>
                <div className = {style.ChangeDir} onClick={() => setPenToEth(!penToEth)}>
                    <i></i>
                </div>
                <div-back>
                    <p>到</p>
                    <h4>{penToEth ? "ETH 资产" : "PEN 代币"}</h4>
                </div-back>
                <br></br>
                <br></br>
                <small>输入</small>
                <div className={style.Input}>
                    <input type="text"
                           value={inputAmount}
                           onChange={e => handleInputChange(e.target.value)}
                           placeholder="输入金额"
                    ></input>
                    <span>{penToEth ? "PEN" : "ETH"}</span>
                    <button onClick={()=>handleInputChange(ethers.formatUnits(penToEth? penCount : ethCount, 18))}>最大</button>
                </div>
                <small>获得</small>
                <div className={style.Input}>
                    <input type="text"
                           value={outputAmount}
                           onChange={e => handleOutputChange(e.target.value)}
                           placeholder="获得金额"
                    ></input>
                    <span>{penToEth ? "ETH" : "PEN"}</span>
                    <button onClick={()=>handleInputChange(ethers.formatUnits(penToEth? penCount : ethCount, 18))}>最大</button>
                </div>
                <div className={style.ButtonArea}>
                    <GreenButton name="确定" clickHandle={swapHandler}></GreenButton>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <LineChart arr={[1,2,3,5,7,9,11,11.9,12.1,12.2,12.2,12.2,11,11,1,2,4,8,9,19,9,8,4,2,1,3,6,8,9,8,9,8,9,8]}></LineChart>
            </div>
            <div className={style.Right}>
                <TradeHistory></TradeHistory>
            </div>
        </div-main>
    )
}

export default  Trade