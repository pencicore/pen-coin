import style from './LogoutNFT.module.scss'
import userStore from "../../store/userStore.js";
import {useEffect, useState} from "react";
import {GetNftList} from "../../api/nftBackendApi.js";

const LogoutNFT = () => {
    const {address, nftPenCount} = userStore()
    const [nftListPage, setNftListPage] = useState([])

    const updateInfo = async () => {
        if (address){
            const res = await GetNftList(address)
            setNftListPage(res.data || [])
        } else {
            setNftListPage([])
        }
    }

    useEffect(() => {
        updateInfo()
    }, [nftPenCount, address])   // 建议把 address 也放依赖

    return (
        <div-container className={style.LogoutNFT}>
            <i></i>
            <p>NFT列表</p>
            <div className={style.NFTArea}>
                <div className={style.NFTAreaScroll}>
                    {nftListPage.map(item => (
                        <div className={style.NFTItem} key={item.tokenId}>
                            <img alt="token" src={item.imageUrl} />
                            <p>PEN NFT #{item.tokenId}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div-container>
    )
}

export default LogoutNFT
