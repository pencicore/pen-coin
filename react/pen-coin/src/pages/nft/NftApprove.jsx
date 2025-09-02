import style from './NftApprove.module.scss'
import {useState} from "react";
import userStore from "../../store/userStore.js";
import {ethers} from "ethers";
import erc20ContractApi from "../../api/erc20ContractApi.js";
import {ContractAddressConfig} from "../../config/contractAddressConfig.js";

const LoginKey = ({closeHandle}) => {

    const {penCount, penTradeCount, setPlayCount} = userStore()
    const [isOk, setIsOk] = useState(false)
    const [isAdd, setIsAdd] = useState(true)
    const [amount, setAmount] = useState()
    const [newPenTradeCount, setNewPenTradeCount] = useState(BigInt(penTradeCount))

    const changeAmountHandle = (value) => {
        if (isNaN(Number(value))) return
        setAmount(value)
        let useNewPenTradeCount
        if (!isAdd) useNewPenTradeCount = (BigInt(penTradeCount) - BigInt(Number(value) * 10 ** 9) * 10n ** 9n)
        else useNewPenTradeCount = (BigInt(penTradeCount) + BigInt(Number(value) * 10 ** 9) * 10n ** 9n)
        setNewPenTradeCount(useNewPenTradeCount)
        if (value !== null && value !== "" && useNewPenTradeCount > 0n) setIsOk(true)
        else setIsOk(false)
    }

    const changeIsAddHandle = () => {
        const target = !isAdd
        setIsAdd(target)
        if (isNaN(Number(amount))) return
        let useNewPenTradeCount
        if (!target) useNewPenTradeCount = (BigInt(penTradeCount) - BigInt(Number(amount) * 10 ** 9) * 10n ** 9n)
        else useNewPenTradeCount = (BigInt(penTradeCount) + BigInt(Number(amount) * 10 ** 9) * 10n ** 9n)
        setNewPenTradeCount(useNewPenTradeCount)
        if (amount !== null && amount !== "" && useNewPenTradeCount >= 0n) setIsOk(true)
        else setIsOk(false)
    }

    const maxHandler = () => {
        if (isAdd) {
            changeAmountHandle(Number(penCount/(10n ** 9n) - penTradeCount/(10n ** 9n))/(10 ** 9))
        }
        else {
            changeAmountHandle(penTradeCount)
        }
    }

    const approveHandle = () => {
        erc20ContractApi.approve(ContractAddressConfig.ERC721, newPenTradeCount)
            .then((res) => {
                if ( res) console.log("授权成功")
                else console.log("授权失败")
                setPlayCount()
                closeHandle()
            })
    }

    return (
        <div className={style.LoginKey}>
            <h4>修改授权代币数量</h4>
            <p className={style.Description}>{isAdd ? "增加" : "减少"}授权代币</p>
            <button style={{
                left: "130px",
                top: "76px"}}
                onClick={() => changeIsAddHandle()}>
                {!isAdd ? "增加" : "减少"}
            </button>

            <div className={style.Input}>
                <input type="text"
                        value={amount}
                        onChange={(e) => changeAmountHandle(e.target.value)}
                       placeholder="授权金额"
                ></input>
                <span>PEN</span>
                <button onClick={maxHandler}>最大</button>
            </div>
            <p className={style.Address}
               style={{color: penTradeCount<newPenTradeCount ? "red" : "green"}}>
                {Number(ethers.formatUnits(penTradeCount, 18)).toPrecision(6)}
                &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
                {Number(ethers.formatUnits(newPenTradeCount, 18)).toPrecision(6)}
            </p>
            {!isOk && <div className={style.ButtonReady}>确定</div>}
            {isOk && <div className={style.ButtonOk} onClick={approveHandle}>确定</div>}
        </div>
    )
}

export default LoginKey