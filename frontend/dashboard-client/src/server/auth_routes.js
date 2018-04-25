import axios from "axios";
import { configData } from '../config.js';

let api_inst = axios.create({
    baseURL: configData.backend_url,
    timeout: 2000,
    headers: {},
    withCredentials: true
});

export const registerAccount = async (dataObj) => {
    let payload = {
        "username": dataObj.username,
        "password": dataObj.password
    };
    let responseData = await api_inst.post("/auth/register", payload);
    return responseData.data;
};

export const authenticateAccount = async (dataObj) => {
    let payload = {
        "username": dataObj.username,
        "password": dataObj.password
    };
    let responseData = await api_inst.post("/auth/login", payload);
    return responseData.data;
};

export const isAuthenticated = async () => {
    let responseData = await api_inst.get('/auth/verify')
    return responseData.data.success;
};

export function isAuthedBool() {
    isAuthenticated().then(function(response) {
        return response.data.success;
    }).catch(function(err) {
        return err;
    })
}

export const logoutAccount = async () => {
    let responseData = await api_inst.get('/auth/logout');
    return responseData;
};

export const testPost = async () => {
    let responseData = await api_inst.post('/testpost');
    return responseData;
};