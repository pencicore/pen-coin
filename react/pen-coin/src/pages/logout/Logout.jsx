import style from './Logout.module.scss'
import LogoutInfo from "./LogoutInfo.jsx";
import LogoutNFT from "./LogoutNFT.jsx";

const Logout = () => {

    return (
        <div className={style.Logout}>
            <div className={style.InfoArea}>
                <LogoutInfo></LogoutInfo>
            </div>
            <div className={style.NFTArea}>
                <LogoutNFT></LogoutNFT>
            </div>
        </div>
    )
}

export default Logout