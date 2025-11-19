import React from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const { paymentId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { payment, booking, flight, seatsCount } = location.state || {};

    if (!payment || !booking || !flight) {
        return (
            <div className="payment-success-page">
                <div className="error-message">No se encontró la información del pago</div>
                <Link to="/" className="home-link">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="payment-success-page">
            <div className="success-card">
                <div className="success-icon">✅</div>
                <h1>¡Pago Exitoso!</h1>
                <p className="success-message">
                    Tu reserva ha sido confirmada y el pago procesado exitosamente.
                </p>

                <div className="payment-details">
                    <h3>Detalles del Pago</h3>
                    <div className="detail-row">
                        <span>Número de pago:</span>
                        <span>#{payment.id}</span>
                    </div>
                    <div className="detail-row">
                        <span>Método:</span>
                        <span>{payment.metodo}</span>
                    </div>
                    <div className="detail-row">
                        <span>Monto:</span>
                        <span>${payment.monto.toLocaleString()} {payment.moneda}</span>
                    </div>
                    <div className="detail-row">
                        <span>Estado:</span>
                        <span className="status-paid">{payment.estado}</span>
                    </div>
                    <div className="detail-row">
                        <span>Fecha:</span>
                        <span>{new Date(payment.fecha).toLocaleString('es-ES')}</span>
                    </div>
                </div>

                <div className="booking-details">
                    <h3>Detalles de la Reserva</h3>
                    <div className="detail-row">
                        <span>Vuelo:</span>
                        <span>{flight.origen} → {flight.destino}</span>
                    </div>
                    <div className="detail-row">
                        <span>Fecha de salida:</span>
                        <span>{new Date(flight.salida).toLocaleString('es-ES')}</span>
                    </div>
                    <div className="detail-row">
                        <span>Clase:</span>
                        <span>{booking.clase}</span>
                    </div>
                    <div className="detail-row">
                        <span>Asientos:</span>
                        <span>{seatsCount} asiento(s) - Principal: {booking.asiento}</span>
                    </div>
                    <div className="detail-row">
                        <span>Número de reserva:</span>
                        <span>#{booking.id}</span>
                    </div>
                </div>

                <div className="success-actions">
                    <Link to="/" className="home-btn">
                        Volver al Inicio
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="print-btn"
                    >
                        Imprimir Comprobante
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;