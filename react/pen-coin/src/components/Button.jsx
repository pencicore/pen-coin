import style from './Button.module.scss'

export const GreenButton = ({name, clickHandle}) => {
    return  (
        <div className={style.Button + ' ' + style.Green} onClick={clickHandle}>{name}</div>
        )
}

export const BlueButton = ({name, clickHandle}) => {
    return  (
        <div className={style.Button + ' ' + style.Green} onClick={clickHandle}>{name}</div>
    )
}

