import style from './NftInfo.module.scss'
import leftImg from '../../assets/images/i-leftitem.png';
import rightImg from '../../assets/images/i-rightitem.png';
import Avatar from "react-avatar";
import NftInfoHistory from "./NftInfoHistory.jsx";
import {useEffect, useState} from "react";
import {GetNftInfo} from "../../api/nftBackendApi.js";
import strUtil from "../../utils/strUtil.js";
import userStore from "../../store/userStore.js";
import {showModal} from "../../containers/ModelPortal.jsx";
import NftSellCard from "./NftSellCard.jsx";
import JsonUtil from "../../utils/jsonUtil.js";

function formatIsoDate(isoString, fullMonth = false) {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid ISO date string");
    }

    const options = {
        year: 'numeric',
        month: fullMonth ? 'long' : 'short',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
}

function NftInfo({paramTokenId, paramTokenList=[]}) {

    const {address} = userStore()
    const [tokenId, setTokenId] = useState(paramTokenId);
    const [tokenName, setTokenName] = useState("PEN NFT #0");
    const [tokenDescription, setTokenDescription] = useState("描述");
    const [tokenImage, setTokenImage] = useState();
    const [tokenOwner, setTokenOwner] = useState("");
    const [tokenLastSale, setTokenLastSale] = useState(200.0);
    const [tokenCreated, setTokenCreated] = useState("2020-08-31T17:12:55.479+08:00");
    const [tokenHistory, setTokenHistory] = useState([]);

    const updateInfo = (res) => {
        if(res.nft) {
            JsonUtil.fetchJsonByTokenId(tokenId).then(json => {
                setTokenName(json.name)
                setTokenDescription(json.description)
            })
            const info = res.nft
            setTokenOwner(info.Address)
            setTokenImage(info.ImageUrl)
            setTokenCreated(info.CreatedAt)
            setTokenHistory(res.history)
            setTokenLastSale(res.history[res.history.length - 1].Amount)
        }
    }

    const leftNftHandle = () => {
        const index = paramTokenList.indexOf(Number(tokenId))
        const length = paramTokenList.length
        setTokenId(paramTokenList[(index - 1 + length)%length])
    }

    const rightNftHandle = () => {
        const index = paramTokenList.indexOf(Number(tokenId))
        const length = paramTokenList.length
        setTokenId(paramTokenList[(index + 1)%length])
    }

    useEffect(() => {
        GetNftInfo(tokenId).then(res => {
            updateInfo(res.data)
        })
        console.log(address, tokenOwner, address===tokenOwner)
    }, [tokenId]);

    return(
        <div className={style.NftInfo}>
            {paramTokenList.length > 1 && <img src={leftImg} alt={"left"} className={style.NextNft} style={{left: 0}} onClick={leftNftHandle}></img>}
            {(address.toLowerCase() === tokenOwner.toLowerCase()) &&
                <div className={style.Header}>
                    <button className={style.SendBtn}>发送</button>
                    <button className={style.PlaceBtn}>拍卖</button>
                    <button className={style.SellBtn} onClick={() => showModal({
                        content: (
                            <NftSellCard tokenId={tokenId}></NftSellCard>
                        ),
                    })}>出售</button>
                </div>
            }
            <div className={style.Main}>
                <div className={style.Left}>
                    <h1>{tokenName}</h1>
                    <div className={style.Info}>
                        <div className={style.AvatarArea}>
                            <Avatar name={strUtil.maskAddress(tokenOwner)}  size="24" round={true}></Avatar>
                        </div>
                        <p className={style.OwnerAddress}>@ {tokenOwner}</p>
                        <span className={style.OwnerIcon}>owner</span>
                    </div>
                    <p className={style.NftDescription}>{tokenDescription}</p>
                    <img alt={"tokenImage"} src={tokenImage} className={style.NftImage}></img>
                </div>
                <div className={style.Line}></div>
                <div className={style.Right}>
                    <div className={style.InfoBack}>
                        <p className={style.InfoSecondText}>Token ID</p>
                        <p className={style.InfoFirstText}># {tokenId}</p>
                    </div>
                    <div className={style.InfoBack}>
                        <p className={style.InfoSecondText}>Last Sale</p>
                        <p className={style.InfoFirstText}>{tokenLastSale} PEN</p>
                    </div>
                    <div className={style.InfoBack}>
                        <p className={style.InfoSecondText}>Created</p>
                        <p className={style.InfoFirstText}>{formatIsoDate(tokenCreated)}</p>
                    </div>
                    <br></br>
                    <br></br>
                    <NftInfoHistory historyList={tokenHistory}></NftInfoHistory>
                </div>
            </div>
            {paramTokenList.length > 1 && <img src={rightImg} alt={"right"} className={style.NextNft} style={{right: 0}} onClick={rightNftHandle}></img>}
        </div>
    )

}

export default NftInfo;