import style from './NftTradePage.module.scss'
import {useEffect, useState} from "react";

function NftTradePage() {

  const [inputTokenId, setInputTokenId] = useState();
  const [inputAddress, setInputAddress] = useState();
  const [orders, setOrders] = useState([])

    const updateOrders = () => {
        const temp = []
        for(let i=1;i<=12;i++) {
            temp.push(
                <div className={style.Order}>
                    <img alt="order" src={"https://img.js.design/assets/img/689998c8b5e8b987e5be2fb6.png#13a047cfd216f83a700595d35a320c2f"}></img>
                    <small>Token：<mark>ABCDEFGH12345678</mark></small>
                    <small>Price：<mark>3000 PEN</mark></small>
                </div>
            )
        }
        setOrders(temp)
    }

    useEffect(() => {
        updateOrders()
    }, []);

  return (
    <div-container className={style.NftTradePage}>
      <div className={style.Title}>
          <i className={style.IconFind}></i>
          <input
              placeholder="输入tokenId查询挂单"
              value={inputTokenId}
              onChange={(e) => setInputTokenId(e.target.value)}
          />
          &nbsp;&nbsp;
          <i className={style.IconFind}></i>
          <input
              placeholder="输入账户地址查询挂单"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <i className={style.IconLeft}></i>
          <p>&nbsp;3&nbsp;</p>
          <i className={style.IconRight}></i>
          &nbsp;&nbsp;&nbsp;
          <small>第 <mark>3</mark> 页，共 <mark>7</mark> 页</small>
      </div>
        {orders}
    </div-container>
  )
}

export default NftTradePage