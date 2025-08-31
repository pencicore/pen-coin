import style from './NftTrade.module.scss'
import {GreenButton} from "../../components/Button.jsx";
import NftTradePage from "./NftTradePage.jsx";
import NftTradeHistory from "./NftTradeHistory.jsx";
import {useState} from "react";
import RndWindow from "../../containers/RndWindow.jsx";
import NftApprove from "./NftApprove.jsx";

function NftTrade() {

    const [approve, setApprove] = useState(false)

  return (
    <div-main className={style.NftTrade}>
        <div className={style.Left}>
            <h1>PEN-NFT去中心化交易所</h1>
            <h5>使用PEN代币购买NFT</h5>
            <div-back><p>今日成交 <mark>31</mark> 单</p></div-back>
            <div-back><p>交易量 <mark>31 PEN</mark></p></div-back>
            <div className={style.ButtonArea}>
                <GreenButton name={"授权交易代币"} clickHandle={()=>setApprove(true)}></GreenButton>
            </div>
            <br></br>
            <br></br>
            <NftTradePage></NftTradePage>
        </div>
        <div className={style.Right}>
            <NftTradeHistory></NftTradeHistory>
        </div>
        {approve && (
            <RndWindow closeHandle={()=>setApprove(false)}>
                <NftApprove closeHandle={()=>setApprove(false)}></NftApprove>
            </RndWindow>
        )}
    </div-main>
  )
}

export default NftTrade