import axios from "axios";
import { configData } from '../config.js';

let api_inst = axios.create({
    baseURL: configData.backend_url,
    timeout: 1000,
    headers: {
        // cookie: cookie,
    },
    withCredentials: true
});

export const registerAccount = async (dataObj) => {
    let payload = {
        "username": dataObj.username,
        "password": dataObj.password
    };
    let responseData = await api_inst.post("/register", payload);
    console.log(responseData.data, "within transport-layer - registerAccount");
    return responseData.data.code;
};

export const authenticateAccount = async (dataObj) => {
    let payload = {
        "username": dataObj.username,
        "password": dataObj.password
    };
    console.log("pre-sending");
    let responseData = await api_inst.post("/login", payload);
    console.log(responseData.data, "within transport-layer - authenticateAccount");
    return responseData.data.code;
};

export const isAuthenticated = async () => {
    console.log("isAuthenticated - transport layer");
    let responseData = await api_inst.get('/checkauth');
    return responseData;
};

export const logoutAccount = async () => {
    let responseData = await api_inst.get('/logout');
    return responseData;
}
