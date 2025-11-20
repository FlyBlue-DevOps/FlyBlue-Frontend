import api from '../api';

export const flightsService = {
    // Obtener todos los vuelos
    getAllFlights: async () => {
        const response = await api.get('/vuelos/');
        return response.data;
    },

    // Obtener un vuelo por ID
    getFlightById: async (flightId) => {
        const response = await api.get(`/vuelos/${flightId}`);
        return response.data;
    },

    // Buscar vuelos (si necesitas filtros más adelante)
    searchFlights: async (searchParams) => {
        const response = await api.get('/vuelos/', { params: searchParams });
        return response.data;
    }
};