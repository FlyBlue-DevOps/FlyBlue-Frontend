import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://34.238.191.219:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const tokenType = localStorage.getItem('token_type') || 'bearer';

        if (token) {
            config.headers.Authorization = `${tokenType} ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('token_type');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;