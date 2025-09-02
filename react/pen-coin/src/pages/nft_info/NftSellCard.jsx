import React, {useEffect, useState} from "react";
import style from "./NftSellCard.module.scss";
import JsonUtil from "../../utils/jsonUtil.js";
import toastUtil from "../../utils/toastUtil.js";
import nftContractApi from "../../api/nftContractApi.js";
import NumberUtil from "../../utils/numberUtil.js";
import {ContractAddressConfig} from "../../config/contractAddressConfig.js";
import {FullWindowController} from "../../containers/ScreenWindow.jsx";

const NftSellCard = ({tokenId, closeHandle}) => {
    const [name, setName] = useState("");
    const [nftImage, setNftImage] = useState("");
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        JsonUtil.fetchJsonByTokenId(tokenId).then(
            json => {
                setName(json.name);
                setNftImage(json.image);
            }
        )
    }, []);

    const handleSell = async () => {
        if (!price) {
            toastUtil.log("请输入价格")
            return;
        }

        setLoading(true);
        const res = await nftContractApi.listNFT(tokenId, NumberUtil.floatToBigInt(price), ContractAddressConfig.ERC721);
        console.log(res)
        setTimeout(() => {
            setLoading(false);
        }, 1500);
        closeHandle()
        FullWindowController.close("token")
    };

    return (
        <div className={style.NftCard}>
            {/* NFT 图片 */}
            <div className={style.ImageBox}>
                <img src={nftImage} alt="NFT" />
            </div>

            {/* NFT 名称 */}
            <div className={style.Name}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* 售卖表单 */}
            <div className={style.Form}>
                <label>售价 (PEN)</label>
                <input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                    <div className={style.Preview}>
                        预计收益 <span>{price} PEN</span>
                    </div>

                <button onClick={handleSell} disabled={loading}>
                    {loading ? "正在发布..." : "确认售出"}
                </button>
            </div>
        </div>
    );
};

export default NftSellCard;
