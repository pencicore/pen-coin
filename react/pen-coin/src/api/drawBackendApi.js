import axios from "axios";
import {BackendConfig} from "../config/backendConfig.js";

const api = axios.create({
    baseURL: BackendConfig.URL+'/draw',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const PageDrawHistory = async (page, size) => {
    const response = await api.get('/pageDrawHistory', {
        params: {
            page: page,
            size: size,
        }
    })
    return response.data
}