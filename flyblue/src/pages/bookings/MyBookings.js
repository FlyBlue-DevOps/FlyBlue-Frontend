import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingsService } from '../../services/bookings/bookingsService';
import { flightsService } from '../../services/flights/flightsService';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, getUserId } = useAuth();

    useEffect(() => {
        loadUserBookings();
    }, []);

    const loadUserBookings = async () => {
        try {
            setLoading(true);

            // Obtener todas las reservas del endpoint
            const allBookings = await bookingsService.getUserBookings();

            // Filtrar solo las reservas del usuario actual
            const userId = getUserId();
            console.log('User ID:', userId);
            console.log('All bookings:', allBookings);

            const userBookings = allBookings.filter(booking =>
                booking.usuario_id === parseInt(userId)
            );

            console.log('Filtered bookings:', userBookings);

            // Enriquecer las reservas con información del vuelo
            const bookingsWithFlightInfo = await Promise.all(
                userBookings.map(async (booking) => {
                    try {
                        const flight = await flightsService.getFlightById(booking.vuelo_id);
                        return {
                            ...booking,
                            flight
                        };
                    } catch (error) {
                        console.error('Error loading flight for booking:', booking.vuelo_id, error);
                        return {
                            ...booking,
                            flight: null
                        };
                    }
                })
            );

            setBookings(bookingsWithFlightInfo);

        } catch (err) {
            setError('Error al cargar las reservas');
            console.error('Error loading bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (estado) => {
        const statusConfig = {
            'confirmada': { class: 'status-confirmed', label: 'Confirmada' },
            'pendiente': { class: 'status-pending', label: 'Pendiente' },
            'cancelada': { class: 'status-cancelled', label: 'Cancelada' },
            'pagado': { class: 'status-paid', label: 'Pagado' }
        };

        const config = statusConfig[estado?.toLowerCase()] || { class: 'status-default', label: estado };
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    const getClassBadge = (clase) => {
        return <span className="class-badge">{clase?.charAt(0).toUpperCase() + clase?.slice(1)}</span>;
    };

    if (loading) {
        return (
            <div className="my-bookings-page">
                <div className="loading">Cargando tus reservas...</div>
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <div className="bookings-header">
                <h1>Mis Reservas</h1>
                <p>Gestiona y revisa todas tus reservas de vuelo</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="bookings-list">
                {bookings.length === 0 ? (
                    <div className="no-bookings">
                        <div className="no-bookings-icon">📋</div>
                        <h3>No tienes reservas</h3>
                        <p>Cuando hagas una reserva, aparecerá aquí.</p>
                        <Link to="/" className="book-flight-btn">
                            Reservar un Vuelo
                        </Link>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <div className="booking-info">
                                    <div className="booking-id">
                                        Reserva #${booking.id}
                                    </div>
                                    <div className="booking-date">
                                        Reservado el: {formatDate(booking.fecha_reserva)}
                                    </div>
                                </div>
                                <div className="booking-status">
                                    {getStatusBadge(booking.estado)}
                                </div>
                            </div>

                            {booking.flight ? (
                                <div className="flight-info">
                                    <div className="route">
                                        <div className="city">
                                            <span className="city-name">{booking.flight.origen}</span>
                                            <span className="flight-date">
                                                {formatDate(booking.flight.salida)}
                                            </span>
                                        </div>
                                        <div className="arrow">→</div>
                                        <div className="city">
                                            <span className="city-name">{booking.flight.destino}</span>
                                            <span className="flight-date">
                                                {formatDate(booking.flight.llegada)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flight-details">
                                        <div className="detail">
                                            <span className="label">Duración:</span>
                                            <span className="value">
                                                {Math.floor(booking.flight.duracion / 60)}h {booking.flight.duracion % 60}m
                                            </span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Clase:</span>
                                            <span className="value">{getClassBadge(booking.clase)}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Asiento:</span>
                                            <span className="value">{booking.asiento || 'No asignado'}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flight-info">
                                    <div className="no-flight-info">
                                        Información del vuelo no disponible (ID: {booking.vuelo_id})
                                    </div>
                                </div>
                            )}

                            <div className="booking-footer">
                                <div className="booking-total">
                                    Total: <span className="total-amount">${booking.total?.toLocaleString()}</span>
                                </div>

                                <div className="booking-actions">
                                    {booking.estado?.toLowerCase() === 'confirmada' && (
                                        <button className="action-btn details-btn">
                                            Ver Detalles
                                        </button>
                                    )}
                                    {booking.estado?.toLowerCase() === 'pendiente' && (
                                        <button className="action-btn pay-btn">
                                            Completar Pago
                                        </button>
                                    )}
                                    <button className="action-btn cancel-btn">
                                        Cancelar
                                    </button>
                                </div>
                            </div>

                            {/* Servicios adicionales si existen */}
                            {booking.servicios_reserva && booking.servicios_reserva.length > 0 && (
                                <div className="services-section">
                                    <h4>Servicios Adicionales</h4>
                                    <div className="services-list">
                                        {booking.servicios_reserva.map(service => (
                                            <div key={service.id} className="service-item">
                                                <span className="service-name">Servicio #{service.servicio_id}</span>
                                                <span className="service-quantity">x{service.cantidad}</span>
                                                <span className="service-subtotal">${service.subtotal?.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBookings;