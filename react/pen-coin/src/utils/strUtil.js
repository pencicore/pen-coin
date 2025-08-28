import {ethers} from "ethers";
import Decimal from "decimal.js";

const strUtil = {
    maskAddress(address, start = 4, end = 4) {
        if (!address) return "";
        if (address.length <= start + end) return address; // too short to mask
        return `${address.slice(2, start+2)}****${address.slice(-end)}`;
    },
    ethBalanceToString(balance) {
        if (!balance) return "0";
        const ethValue = ethers.formatEther(BigInt(balance));
        const num = Number(ethValue);
        return num.toPrecision(8);
    },
    ethStringToString(balance) {
        const d = new Decimal(balance);
        return d.toSignificantDigits(8).toString();
    },
    dateTimeToString(dateTime) {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
}

export default strUtil