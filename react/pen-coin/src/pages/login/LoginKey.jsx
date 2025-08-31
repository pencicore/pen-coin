import style from './LoginKey.module.scss'
import {useState} from "react";
import {localMaskUtil} from '../../utils/localMaskUtil.js'
import userStore from "../../store/userStore.js";
import {FullWindowController} from "../../containers/ScreenWindow.jsx";
import toastUtil from "../../utils/toastUtil.js";

const LoginKey = () => {

    const [privateKey, setPrivateKey] = useState('')
    const [address, setAddress] = useState('')
    const [isOk, setIsOk] = useState(false)
    const {setLogin} = userStore()

    const handlePastButton = async () => {
        const text = await navigator.clipboard.readText();
        handleChange(text)
    }

    const handleRandomButton = () => {
        const privateKey = localMaskUtil.getRandomPrivateKey()
        handleChange(privateKey)
    }

    const handleChangeTextarea = (e) => {
        const privateKey = e.target.value
        handleChange(privateKey)
    }

    const handleChange = (privateKey) => {
        setPrivateKey(privateKey)
        if (localMaskUtil.check(privateKey)) {
            setAddress(localMaskUtil.getAddress(privateKey))
            setIsOk(true)
        }
        else {
            setIsOk(false)
        }
    }

    const handleLogin = () => {
        localMaskUtil.login(privateKey)
        FullWindowController.close()
        setLogin(true)
        toastUtil.log('登录成功')
    }

  return (
      <div className={style.LoginKey}>
          <h4>输入私钥或记阻词</h4>
          <textarea
              placeholder="若使用记助词，请使用空格分隔每个单词"
              maxLength={200}
              value={privateKey}         // bind state
              onChange={handleChangeTextarea}    // update state
          >
          </textarea>
          <button onClick={handlePastButton}>粘贴</button>
          <button onClick={handleRandomButton}>随机生成</button>
          {isOk && <p className={style.Address}>地址：{address}</p>}
          <div className={isOk? style.ButtonOk: style.ButtonReady} onClick={handleLogin}>确定</div>
      </div>
  )
}

export default LoginKey