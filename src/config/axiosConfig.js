import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL
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
