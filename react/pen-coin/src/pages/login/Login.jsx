import style from './Login.module.scss'

function Login() {
  return (
    <div className={style.Login}>
      <h1>LOGIN</h1>
        <button>
            <i className={style.IMeta}></i>
            <p>&nbsp;&nbsp;连接 钱包 登录</p>
        </button>
        <div className={style.Ora}>
            or
            <div></div>
            <div></div>
        </div>
        <button>
            <i className={style.IKey}></i>
            <p>&nbsp;&nbsp;输入 私钥 登录</p>
        </button>
    </div>
  )
}

export default Login