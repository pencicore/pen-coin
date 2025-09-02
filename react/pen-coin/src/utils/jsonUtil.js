const JsonUtil = {
    async fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                return null
            }
             // 自动转成对象
            return await response.json();
        } catch (error) {
            console.error("获取 JSON 出错:", error);
            return null;
        }
    },
    async fetchJsonByTokenId(tokenId) {
        return await this.fetchJson(`oss/nft/metadata/${tokenId}.json`)
    }
}

export default JsonUtil