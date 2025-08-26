const dateUtil = {
    getTodayNumber() {
        // 当前时间戳（毫秒）
        const now = Date.now();

        // 转换为秒
        const timestamp = Math.floor(now / 1000);

        // 加 8 小时，转换为北京时间
        const beijingTimestamp = timestamp + 8 * 60 * 60;

        // 一天 = 86400 秒，取整得到 dayNumber
        return Math.floor(beijingTimestamp / 86400);
    },
    getCurrentYear() {
        return new Date().getFullYear()
    },
    getCurrentMonth() {
        return new Date().getMonth() + 1
    },
    getCurrentDay() {
        return new Date().getDate()
    }
}

export default dateUtil;