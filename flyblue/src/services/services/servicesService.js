import api from '../api';

export const servicesService = {
    // Obtener todos los servicios
    getAllServices: async () => {
        const response = await api.get('/servicios/');
        return response.data;
    },

    // Agregar servicio a una reserva
    addServiceToBooking: async (bookingId, servicioId, cantidad = 1) => {
        const response = await api.post(`/reservas/${bookingId}/agregar-servicio`, null, {
            params: {
                servicio_id: servicioId,
                cantidad: cantidad
            }
        });
        return response.data;
    }
};