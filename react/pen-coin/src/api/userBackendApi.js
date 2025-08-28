import axios from "axios";
import {BackendConfig} from "../config/backendConfig.js";
import strUtil from "../utils/strUtil.js";

const api = axios.create({
    baseURL: BackendConfig.URL+'/user',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const GetBalanceHistory = async (address, begin, end) => {
    const response = await api.get('/getBalanceHistory', {
        params: {
            address: address,
            begin:strUtil.dateTimeToString(begin),
            end:strUtil.dateTimeToString(end),
        }
    })
    return response.data
}

export const GetUserInfo = async (address) => {
    const response = await api.get('/getUserInfo', {
        params: {
            address: address,
        }
    })
    return response.data
}

export const PageEventHistory = async (address, page, size) => {
    const response = await api.get('/pageEventHistory', {
        params: {
            address: address,
            page: page,
            size: size,
        }
    })
    return response.data
}