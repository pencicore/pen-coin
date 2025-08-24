import {ContractAddressConfig} from "../config/contractAddressConfig.js";
import maskUtil from "../utils/maskUtil.js";
import {ethers} from "ethers";

const faucetContractApi = {
    contract: null,
    async getContract() {
        if (this.contract === null) {
            this.contract = new ethers.Contract(ContractAddressConfig.Faucet, ABI, await maskUtil.getSingle())
        }
        return this.contract
    },
    async requestedAddress(address) {
        return await (await this.getContract()).requestedAddress(address)
    },
    async requestTokens() {
        const tx = await (await this.getContract()).requestTokens()
        const receipt = await tx.wait()
        return receipt.status === 1
    }
}

export default faucetContractApi

const ABI = [
    {
        "inputs": [],
        "name": "requestTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenContract",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "Receiver",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "Amount",
                "type": "uint256"
            }
        ],
        "name": "SendToken",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "amountAllowed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "requestedAddress",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenContract",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]