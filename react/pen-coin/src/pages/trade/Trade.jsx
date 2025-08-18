import style from './Trade.module.scss'
import {GreenButton} from "../../components/Button.jsx";
import LineChart from "../../components/LineChart.jsx";
import TradeHistory from "./TradeHistory.jsx";

function Trade() {
    return (
        <div-main className={style.Trade}>
            <div className={style.Left}>
                <h1>代币交易</h1>
                <h5>PEN-ETH币币交易</h5>
                <div-back>
                    <p>从</p>
                    <h4>PEN 代币</h4>
                </div-back>
                <div className = {style.ChangeDir}>
                    <i></i>
                </div>
                <div-back>
                    <p>到</p>
                    <h4>ETH 资产</h4>
                </div-back>
                <br></br>
                <br></br>
                <small>输入</small>
                <div className={style.Input}>
                    <input type="text" placeholder="输入金额"></input>
                    <span>PEN</span>
                    <button>最大</button>
                </div>
                <small>获得</small>
                <div className={style.Input}>
                    <input type="text" placeholder="获得金额"></input>
                    <span>ETH</span>
                    <button>最大</button>
                </div>
                <div className={style.ButtonArea}>
                    <GreenButton name="确定"></GreenButton>
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