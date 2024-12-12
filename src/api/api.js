import axios from "axios";
import { getStorageToken } from "../helper/storage";

const instance = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  timeout: 5000,
});

export default instance;

instance.interceptors.request.use(
  (config) => {
    const token = getStorageToken();
    config.headers = {
      Authorization: `${token?.tokenType}${token?.accessToken}`,
      // "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    console.log("intercept에서 오류 발생", error);
    return Promise.reject(error);
  }
);
