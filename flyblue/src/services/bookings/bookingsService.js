import api from '../api';

export const bookingsService = {
    // Crear una reserva
    createBooking: async (bookingData) => {
        const response = await api.post('/reservas/', bookingData);
        return response.data;
    },

    // Obtener reservas del usuario
    getUserBookings: async () => {
        const response = await api.get('/reservas/usuario');
        return response.data;
    },

    // Obtener una reserva por ID
    getBookingById: async (bookingId) => {
        const response = await api.get(`/reservas/${bookingId}`);
        return response.data;
    }
};