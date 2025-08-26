import axios from "axios";
import {BackendConfig} from "../config/backendConfig.js";
import maskUtil from "../utils/maskUtil.js";

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