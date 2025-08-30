import axios from "axios";
import {BackendConfig} from "../config/backendConfig.js";
import strUtil from "../utils/strUtil.js";

const api = axios.create({
    baseURL: BackendConfig.URL+'/swap',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const PageSwapHistory = async (page, size) => {
    const response = await api.get('/pageSwapHistory', {
        params: {
            page: page,
            size: size,
        }
    })
    return response.data
}

export const GetSwapHistory = async (begin, end) => {
    const response = await api.get('/getSwapHistory', {
        params: {
            begin:strUtil.dateTimeToString(begin),
            end:strUtil.dateTimeToString(end),
        }
    })
    return response.data
}