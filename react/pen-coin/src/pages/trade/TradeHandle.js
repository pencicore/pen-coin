import {GetBalanceHistory} from "../../api/userBackendApi.js";
import maskUtil from "../../utils/maskUtil.js";
import {data} from "react-router-dom";
import {GetSwapHistory} from "../../api/swapBackendApi.js";

const TradeHandle= {
    async getPriceHistory(type) {
        const now = new Date()
        const beforeDay = new Date(now)
        if (type === 'day') beforeDay.setDate(now.getDate() - 1)
        else if (type === 'week') beforeDay.setDate(now.getDate() - 7)
        else if (type === 'month') beforeDay.setDate(now.getDate() - 30)
        else if (type === 'year') beforeDay.setDate(now.getDate() - 365)
        else beforeDay.setDate(now.getDate() - 1)
        const arr = (await GetSwapHistory(beforeDay, now)).data

        let res
        let sec
        if (type === 'day') {
            res = new Array(24 * 6).fill(0);
            sec = 60 * 10
        }
        if (type === 'week') {
            res = new Array(7 * 24).fill(0);
            sec = 60 * 60
        }
        if (type === 'month') {
            res = new Array(30 * 4).fill(0);
            sec = 60 * 60 * 6
        }
        if (type === 'year') {
            res = new Array(365).fill(0);
            sec = 60 * 60 * 24
        }


        const startTime = beforeDay.getTime();

        // 先把每条记录放到对应下标
        arr.forEach(item => {
            const time = new Date(item.createdAt).getTime();
            const index = Math.floor((time - startTime) / (sec * 1000));
            if (index >= 0 && index < res.length) {
                res[index] = Number(item.reserveETH)/Number(item.reservePEN);
            }
        });

        // 前向填充逻辑
        for (let i = 1; i < res.length; i++) {
            if (res[i] === 0) {
                res[i] = res[i - 1]; // 没有新余额，沿用前一个
            }
        }

        return res;
    },

}

export default TradeHandle;