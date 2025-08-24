import {ethers} from "ethers";

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
    }
}

export default strUtil