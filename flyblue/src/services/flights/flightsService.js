import api from '../api';

export const flightsService = {
    getAvailableFlights: async () => {
        const response = await api.get('/flights/available');
        return response.data;
    },

    searchFlights: async (searchParams) => {
        const response = await api.get('/flights/search', { params: searchParams });
        return response.data;
    },

    getFlightById: async (flightId) => {
        const response = await api.get(`/flights/${flightId}`);
        return response.data;
    }
};