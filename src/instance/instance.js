import axios from "axios";
import { getStorageToken } from "../helper/storage";

const instance = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  timeout: 10000,
});

export default instance;

instance.interceptors.request.use(
  (config) => {
    const user = getStorageToken();
    config.headers = {
      Authorization: `${user.tokenType}${user.accessToken}`,
    };

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
