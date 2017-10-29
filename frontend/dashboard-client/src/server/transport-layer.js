import axios from "axios";
import { configData } from '../config.js';

let api_inst = axios.create({
    baseURL: configData.backend_url,
    timeout: 1000,
    headers: {}
});

export const registerAccount = async (dataObj) => {
    let payload = {
        "username": dataObj.username,
        "password": dataObj.password
    };
    console.log("presending");
    let responseData = await api_inst.post("/register", payload);
    console.log(responseData.data, "within transport-layer - registerAccount");
    return responseData.data.code;
};
