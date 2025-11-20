import api from '../api';

export const usersService = {
    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.put('/users/change-password', passwordData);
        return response.data;
    },

    getBookingHistory: async () => {
        const response = await api.get('/users/bookings');
        return response.data;
    }
};