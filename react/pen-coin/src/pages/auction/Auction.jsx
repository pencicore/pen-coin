import style from './Auction.module.scss'
import AuctionItem from "./AuctionItem.jsx";
import AuctionPriceHistory from "./AuctionPriceHistory.jsx";
import AuctionTradeHistory from "./AuctionTradeHistory.jsx";
import Notice from "../../components/Notice.jsx";

const Auction = () => {
    return (
        <div-main className={style.Auction}>
            <div className={style.Left}>
                <h1>荷兰拍卖</h1>
                <h5>荷兰式拍卖，价格随时间递减，第一位出价者获得商品</h5>
                <AuctionItem></AuctionItem>
                <br></br>
                <br></br>
                <br></br>
                <AuctionPriceHistory></AuctionPriceHistory>
            </div>
            <div className={style.Right}>
                <AuctionTradeHistory></AuctionTradeHistory>
                <div className={style.NoticeArea}>
                    <Notice textArr={[
                        "荷兰拍卖以最高价格为起始价格开始拍卖，价格按设定时间线性降低，第一个出价者获得该商品，同时拍卖结束",
                        "每个拍卖都有低价，价格降低至低价任无人出家，拍卖将流拍",
                        "同一时间仅会有一件商品进行拍卖",
                    ]}></Notice>
                </div>
            </div>
        </div-main>
    )
}

export default Auction

