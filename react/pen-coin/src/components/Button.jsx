import style from './Button.module.scss'

export const MiniGreenButton = ({name, clickHandle}) => {
    return  (
        <div className={style.MiniButton + ' ' + style.MiniGreen} onClick={clickHandle}>{name}</div>
        )
}

export const MiniGreenButtonStop = ({name}) => {
    return  (
        <div className={style.MiniButton + ' ' + style.MiniGreen + ' ' + style.Stop}>{name}</div>
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

export const GreenButtonStop = ({name}) => {
    return  (
        <div className={style.Button + ' ' + style.Green + ' ' + style.Stop}>{name}</div>
    )
}

