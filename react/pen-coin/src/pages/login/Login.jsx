import style from './Login.module.scss'
import {useState} from "react";
import RndWindow from "../../containers/RndWindow.jsx";
import Place from "../../components/Place.jsx";
import LoginMask from "./LoginMask.jsx";
import LoginKey from "./LoginKey.jsx";

function Login() {

    const [mask, setMask] = useState(false);
    const [key, setKey] = useState(false);

  return (
    <div className={style.Login}>
      <h1>LOGIN</h1>
        <button onClick={()=>setMask( true)}>
            <i className={style.IMeta}></i>
            <p>&nbsp;&nbsp;连接 Metamask 登录</p>
        </button>
        <div className={style.Ora}>
            or
            <div></div>
            <div></div>
        </div>
        <button onClick={()=>setKey( true)}>
            <i className={style.IKey}></i>
            <p>&nbsp;&nbsp;输入 私钥 登录</p>
        </button>
        {mask &&
            <RndWindow closeHandle={()=>setMask(false)}>
                <LoginMask></LoginMask>
            </RndWindow>
        }
        {
            key &&
            <RndWindow closeHandle={()=>setKey(false)}>
                <LoginKey></LoginKey>
            </RndWindow>
        }
    </div>
  )
}

export default Login