import erc20ContractApi from "./erc20ContractApi.js";

const ammContractApi = {
    async getContract() {
        return await erc20ContractApi.getContract()
    },
    async getPENPriceInETH() {
        return (await this.getContract()).getPENPriceInETH()
    },
    async getETHPriceInPEN() {
        return (await this.getContract()).getETHPriceInPEN()
    },
}

export default ammContractApi;