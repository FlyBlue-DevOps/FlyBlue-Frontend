import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { paymentsService } from '../../services/payments/paymentsService';
import './PaymentPage.css';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('tarjeta');

    const { booking, flight, seatsCount } = location.state || {};

    const handlePayment = async () => {
        try {
            setProcessing(true);
            setError('');

            const paymentData = {
                reserva_id: parseInt(bookingId),
                metodo: paymentMethod,
                monto: booking.total
                // moneda: "cop" y estado: "pagado" se hardcodean en el servicio
            };

            console.log('Procesando pago:', paymentData);

            const paymentResult = await paymentsService.createPayment(paymentData);

            // Navegar a la página de confirmación
            navigate(`/payment/success/${paymentResult.id}`, {
                state: {
                    payment: paymentResult,
                    booking: booking,
                    flight: flight,
                    seatsCount: seatsCount
                }
            });

        } catch (err) {
            setError('Error al procesar el pago: ' + (err.response?.data?.detail || err.message));
            console.error('Error processing payment:', err);
        } finally {
            setProcessing(false);
        }
    };

    if (!booking || !flight) {
        return (
            <div className="payment-page">
                <div className="error-message">No se encontró la información de la reserva</div>
                <button onClick={() => navigate('/')} className="back-btn">
                    Volver a vuelos
                </button>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-header">
                <h1>Procesar Pago</h1>
                <div className="booking-reference">
                    Reserva #${booking.id}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="payment-content">
                <div className="payment-summary">
                    <h3>Resumen de la Reserva</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Vuelo:</span>
                            <span>{flight.origen} → {flight.destino}</span>
                        </div>
                        <div className="summary-row">
                            <span>Fecha:</span>
                            <span>{new Date(flight.salida).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="summary-row">
                            <span>Clase:</span>
                            <span>{booking.clase}</span>
                        </div>
                        <div className="summary-row">
                            <span>Asiento:</span>
                            <span>{booking.asiento}</span>
                        </div>
                        <div className="summary-row">
                            <span>Asientos totales:</span>
                            <span>{seatsCount}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total a pagar:</span>
                            <span>${booking.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="payment-methods">
                    <h3>Método de Pago</h3>
                    <div className="method-options">
                        {['tarjeta', 'transferencia', 'efectivo'].map(method => (
                            <label key={method} className="method-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="method-name">
                                    {method === 'tarjeta' && '💳 Tarjeta de Crédito/Débito'}
                                    {method === 'transferencia' && '🏦 Transferencia Bancaria'}
                                    {method === 'efectivo' && '💰 Pago en Efectivo'}
                                </span>
                            </label>
                        ))}
                    </div>

                    {paymentMethod === 'tarjeta' && (
                        <div className="card-details">
                            <div className="form-group">
                                <label>Número de tarjeta:</label>
                                <input type="text" placeholder="1234 5678 9012 3456" disabled />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fecha de expiración:</label>
                                    <input type="text" placeholder="MM/AA" disabled />
                                </div>
                                <div className="form-group">
                                    <label>CVV:</label>
                                    <input type="text" placeholder="123" disabled />
                                </div>
                            </div>
                            <small className="note">
                                * Sistema de pago simulado - No se procesarán datos reales
                            </small>
                        </div>
                    )}
                </div>

                <div className="payment-actions">
                    <button
                        onClick={() => navigate(-1)}
                        className="back-btn"
                    >
                        Volver
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="pay-btn"
                    >
                        {processing ? 'Procesando...' : `Pagar $${booking.total.toLocaleString()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;