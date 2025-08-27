import axios from "axios";
import {BackendConfig} from "../config/backendConfig.js";

const api = axios.create({
    baseURL: BackendConfig.URL+'/erc20',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const GetMonthCheckin = async (address, year, month) => {
    const response = await api.get('/getMonthCheckin', {
        params: {
            address: address,
            year: year,
            month: month,
        }
    })
    return response.data
}

export const GetMonthCheckinCount = async (address, year, month) => {
    const response = await api.get('/getMonthCheckinCount', {
        params: {
            address: address,
            year: year,
            month: month,
        }
    })
    return response.data
}

export const GetCheckinCount = async (address) => {
    const response = await api.get('/getCheckinCount', {
        params: {
            address: address,
        }
    })
    return response.data
}

export const GetCheckinInfo = async () => {
    const response = await api.get('/getCheckinInfo')
    return response.data
}

export const GetCheckinReward = async (address) => {
    const response = await api.get('/getCheckinReward', {
        params: {
            address: address,
        }
    })
    return response.data
}