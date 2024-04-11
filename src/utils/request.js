import axios from 'axios';
import router from "@/router";
import {token} from "mysql/lib/protocol/Auth";

const instance = axios.create();

// 添加请求拦截器，在每个请求中包含令牌
instance.interceptors.request.use(config => {
    // 在请求头中添加 Authorization 字段，用于传递 token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    console.log(token);
    console.log(localStorage.getItem('token'));
    return Promise.reject(error);
});

export default instance;
