import style from './LoginKey.module.scss'

const LoginKey = () => {
  return (
      <div className={style.LoginKey}>
          <h4>输入私钥或记阻词</h4>
          <textarea
              placeholder="若使用记助词，请使用空格分隔每个单词"
              maxLength={200}
          >
          </textarea>
          <button>粘贴</button>
          <button>随机生成</button>
          <div className={style.ButtonReady}>确定</div>
      </div>
  )
}

export default LoginKey