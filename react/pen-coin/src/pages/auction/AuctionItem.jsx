import style from './AuctionItem.module.scss'
import {GreenButton} from "../../components/Button.jsx";

const AuctionItem = () => {
    return (
        <div-back className={style.AuctionItem}>
            <img alt={"token"} src={"https://img.js.design/assets/img/689998c8b5e8b987e5be2fb6.png#13a047cfd216f83a700595d35a320c2f"}></img>
            <h4>Token: {"ABCDEFGH12345678"}</h4>
            <div className={style.Info}>
                <p className={style.InfoLeft}>2025/08/02  22:10:00</p>
                <p className={style.InfoRight}>2025/08/04  22:10:00</p>
                <i className={style.InfoCenter}></i>
            </div>
            <div className={style.Info}>
                <p className={style.InfoLeft}><small>起始价：</small>10086 PEN</p>
                <p className={style.InfoRight}><small>底价：</small>1086 PEN</p>
                <i className={style.InfoCenter}></i>
            </div>
            <div className={style.Info}>
                <small>
                    当前价格：<mark className={style.GreenMark}>2000 PEN</mark>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    已降价 <mark>50%</mark>
                </small>
            </div>
            <div className={style.Info}>
                <small>距离下次降价，还剩 <mark>222h:34m:48s</mark></small>
            </div>
            <div className={style.ButtonArea}>
                <GreenButton name={"竞拍"}></GreenButton>
            </div>
        </div-back>
    )
}

export default AuctionItem