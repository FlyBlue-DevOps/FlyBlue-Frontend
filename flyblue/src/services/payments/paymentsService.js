import api from '../api';

export const paymentsService = {
    // Crear un pago
    createPayment: async (paymentData) => {
        // Hardcodear moneda y estado según requerimiento
        const paymentWithDefaults = {
            ...paymentData,
            moneda: "cop",
            estado: "pagado"
        };
        const response = await api.post('/pagos/', paymentWithDefaults);
        return response.data;
    },

    // Obtener pagos del usuario
    getUserPayments: async () => {
        const response = await api.get('/pagos/usuario');
        return response.data;
    }
};