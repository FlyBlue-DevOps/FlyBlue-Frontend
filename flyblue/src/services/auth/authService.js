import api from '../api';

export const authService = {
    login: async (email, contrasena) => {
        console.log('Login request:', { email, contrasena });
        const response = await api.post('/auth/login', {
            email,
            contrasena
        });
        console.log('Login response:', response.data);
        return response.data;
    },

    register: async (userData) => {
        console.log('Register request:', userData);
        const response = await api.post('/auth/register', userData);
        console.log('Register response:', response.data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_type');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getTokenType: () => {
        return localStorage.getItem('token_type') || 'bearer';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};