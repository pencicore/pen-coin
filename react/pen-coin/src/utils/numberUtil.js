const numberUtil = {
    floatToBigInt(num) {
        // 转成字符串，避免浮点误差
        const [intPart, decPart = ""] = String(num).split(".");

        // 把小数部分填充到 18 位
        const decimals = (decPart + "0".repeat(18)).slice(0, 18);

        return BigInt(intPart + decimals);
    }
}

export default numberUtil;