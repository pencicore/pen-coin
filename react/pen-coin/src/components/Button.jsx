import style from './Button.module.scss'

export const MiniGreenButton = ({name, clickHandle}) => {
    return  (
        <div className={style.MiniButton + ' ' + style.MiniGreen} onClick={clickHandle}>{name}</div>
        )
}

export const MiniBlueButton = ({name, clickHandle}) => {
    return  (
        <div className={style.MiniButton + ' ' + style.MiniGreen} onClick={clickHandle}>{name}</div>
    )
}

export const GreenButton = ({name, clickHandle}) => {
    return  (
        <div className={style.Button + ' ' + style.Green} onClick={clickHandle}>{name}</div>
    )
}

