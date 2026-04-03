import axios from 'axios';

import { reportClientError } from '@/lib/monitoring';
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

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        reportClientError(error, {
            source: 'axios.response',
            url: error?.config?.url,
            method: error?.config?.method,
            status: error?.response?.status
        });

        return Promise.reject(error);
    }
);

export default axiosInstance;
