import axios from "axios";
import {BackendConfig} from "../config/backendConfig.js";

const api = axios.create({
    baseURL: BackendConfig.URL+'/nft',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const GetNftList = async (address) =>{
    const response = await api.get('/getNftList', {
        params: {
            address
        }
    })
    return response.data
}
