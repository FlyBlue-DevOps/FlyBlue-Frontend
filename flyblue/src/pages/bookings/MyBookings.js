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
            setError('');

            // Obtener todas las reservas del endpoint
            const allBookings = await bookingsService.getUserBookings();

            // Obtener el ID del usuario actual desde el token
            const userId = getUserId();
            console.log('🔍 User ID desde token:', userId);
            console.log('📋 Todas las reservas:', allBookings);

            if (!userId) {
                setError('No se pudo obtener la información del usuario');
                setLoading(false);
                return;
            }

            // Filtrar solo las reservas del usuario actual
            const userBookings = allBookings.filter(booking => {
                console.log(`Comparando: ${booking.usuario_id} (${typeof booking.usuario_id}) vs ${userId} (${typeof userId})`);
                return booking.usuario_id === parseInt(userId);
            });

            console.log('✅ Reservas del usuario:', userBookings);

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
                        console.error(`Error cargando vuelo ${booking.vuelo_id}:`, error);
                        return {
                            ...booking,
                            flight: null
                        };
                    }
                })
            );

            setBookings(bookingsWithFlightInfo);

        } catch (err) {
            console.error('Error cargando reservas:', err);
            setError('Error al cargar las reservas: ' + (err.message || 'Error desconocido'));
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
                <div className="user-info" style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                    Cédula: {getUserId() || 'No disponible'} |
                    Email: {user?.email} |
                    Rol: {user?.rol}
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={loadUserBookings} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                        Reintentar
                    </button>
                </div>
            )}

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
                                        Reserva #{booking.id}
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
                                            <span className="value">{booking.asiento}</span>
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

                                
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBookings;