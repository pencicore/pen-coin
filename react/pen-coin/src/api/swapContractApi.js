import erc20ContractApi from "./erc20ContractApi.js";

const swapContractApi = {
    async getContract() {
        return await erc20ContractApi.getContract()
    },

    async getPENPriceInETH() {
        return await (await this.getContract()).getPENPriceInETH()
    },

    async getETHPriceInPEN() {
        return await (await this.getContract()).getETHPriceInPEN()
    },

    // ETH -> PEN
    async swapETHForPEN(ethAmount, amountOutMin = 0) {
        const contract = await this.getContract()
        const tx = await contract.swapETHForPEN(amountOutMin, { value: ethAmount })
        return await tx.wait()
    },

    // PEN -> ETH
    async swapPENForETH(penAmount, amountOutMin = 0) {
        const contract = await this.getContract()
        const tx = await contract.swapPENForETH(penAmount, amountOutMin)
        return await tx.wait()
    },
}

export default swapContractApi;
