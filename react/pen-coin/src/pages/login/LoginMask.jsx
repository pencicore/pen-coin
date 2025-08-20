import style from './LoginMask.module.scss'
import {MiniGreenButton} from "../../components/Button.jsx";

const LoginMask = () => {
    return (
        <div className={style.LoginMask}>
            <div className={style.MaskSvg}></div>
            <p>{"检测到钱包登录"}</p>
            <MiniGreenButton name={"连接"}></MiniGreenButton>
        </div>
    )
}

export default LoginMask