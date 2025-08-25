import axios from "axios";
import {BackendConfig} from "../config/backendConfig.js";

const api = axios.create({
    baseURL: BackendConfig.URL+'/faucet',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const GetReceiveBalance = async () => {
    const response = await api.get('/receiveETHBalance')
    return response.data
}

export const GetEthFaucet = async (address) => {
    const response = await api.get('/ethFaucet', {
        params: {
            address: address
        }
    })
    return response.data
}

export const GetHaveEthFaucet = async (address) => {
    const response = await api.get('/haveEthFaucet', {
        params: {
            address: address
        }
    })
    return response.data
}

export const GetReceivePENBalance = async () => {
    const response = await api.get('/receivePENBalance')
    return response.data
}