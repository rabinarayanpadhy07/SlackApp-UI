import axios from 'axios';

import { BACKEND_API_URL } from './runtimeConfig';

const axiosInstance = axios.create({
    baseURL: BACKEND_API_URL,
    timeout: 10000
});

axiosInstance.interceptors.request.use((config) => {
    const token = globalThis.localStorage?.getItem('token');

    if (token && !config.headers?.['x-access-token']) {
        config.headers = {
            ...config.headers,
            'x-access-token': token
        };
    }

    return config;
});

export default axiosInstance;
