import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { servicesService } from '../../services/services/servicesService';
import { bookingsService } from '../../services/bookings/bookingsService';
import './ServicesPage.css';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingService, setAddingService] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { getUserId } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            // Cargar servicios
            const servicesData = await servicesService.getAllServices();
            setServices(servicesData);

            // Cargar reservas del usuario
            const allBookings = await bookingsService.getUserBookings();
            const userId = getUserId();

            if (userId) {
                const userBookingsData = allBookings.filter(booking =>
                    booking.usuario_id === parseInt(userId)
                );
                setUserBookings(userBookingsData);
            }

        } catch (err) {
            setError('Error al cargar los datos');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = async (serviceId, bookingId) => {
        try {
            setAddingService(serviceId);
            setError('');
            setSuccess('');

            // Agregar servicio a la reserva (cantidad 1 por defecto)
            await servicesService.addServiceToBooking(bookingId, serviceId, 1);

            setSuccess('Servicio agregado exitosamente a la reserva');

            // Recargar las reservas para mostrar los servicios actualizados
            setTimeout(() => {
                loadData();
            }, 1000);

        } catch (err) {
            setError('Error al agregar el servicio: ' + (err.response?.data?.detail || err.message));
            console.error('Error adding service:', err);
        } finally {
            setAddingService(null);
        }
    };

    const getStatusBadge = (estado) => {
        const statusConfig = {
            'confirmada': { class: 'status-confirmed', label: 'Confirmada' },
            'pendiente': { class: 'status-pending', label: 'Pendiente' },
            'cancelada': { class: 'status-cancelled', label: 'Cancelada' },
            'pagado': { class: 'status-paid', label: 'Pagado' },
            'completado': { class: 'status-completed', label: 'Completado' },
            'completada': { class: 'status-completed', label: 'Completada' }
        };

        const config = statusConfig[estado?.toLowerCase()] || { class: 'status-default', label: estado };
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return (
            <div className="services-page">
                <div className="loading">Cargando servicios...</div>
            </div>
        );
    }

    return (
        <div className="services-page">
            <div className="services-header">
                <h1>Servicios Adicionales</h1>
                <p>Agrega servicios a cualquiera de tus reservas</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Lista de Servicios */}
            <div className="services-section">
                <h2>Servicios Disponibles</h2>
                <div className="services-grid">
                    {services.length === 0 ? (
                        <div className="no-services">
                            No hay servicios disponibles en este momento.
                        </div>
                    ) : (
                        services.map(service => (
                            <div key={service.id} className="service-card">
                                <div className="service-info">
                                    <h3 className="service-name">{service.nombre}</h3>
                                    <p className="service-description">{service.description}</p>
                                    <div className="service-price">
                                        ${service.precio?.toLocaleString() || '0'}
                                    </div>
                                </div>

                                <div className="service-actions">
                                    <label htmlFor={`booking-select-${service.id}`} className="action-label">
                                        Agregar a reserva:
                                    </label>
                                    <select
                                        id={`booking-select-${service.id}`}
                                        className="booking-select"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Seleccionar reserva</option>
                                        {userBookings.map(booking => (
                                            <option key={booking.id} value={booking.id}>
                                                Reserva #{booking.id} - {getStatusBadge(booking.estado)}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => {
                                            const select = document.getElementById(`booking-select-${service.id}`);
                                            const bookingId = select.value;
                                            if (bookingId) {
                                                handleAddService(service.id, bookingId);
                                            } else {
                                                setError('Por favor selecciona una reserva');
                                            }
                                        }}
                                        disabled={addingService === service.id || userBookings.length === 0}
                                        className="add-service-btn"
                                    >
                                        {addingService === service.id ? 'Agregando...' : 'Agregar Servicio'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Información de Reservas del Usuario */}
            <div className="bookings-section">
                <h2>Todas Tus Reservas</h2>
                <p className="section-subtitle">
                    Puedes agregar servicios a cualquiera de tus reservas, sin importar su estado
                </p>
                <div className="bookings-list">
                    {userBookings.length === 0 ? (
                        <div className="no-bookings">
                            No tienes reservas registradas.
                        </div>
                    ) : (
                        userBookings.map(booking => (
                            <div key={booking.id} className="booking-item">
                                <div className="booking-info">
                                    <span className="booking-id">Reserva #{booking.id}</span>
                                    <span className="booking-status">{getStatusBadge(booking.estado)}</span>
                                </div>
                                <div className="booking-details">
                                    <span>Vuelo ID: {booking.vuelo_id}</span>
                                    <span>Clase: {booking.clase}</span>
                                    <span>Asiento: {booking.asiento}</span>
                                </div>
                                <div className="booking-services">
                                    <strong>Servicios:</strong>
                                    {booking.servicios_reserva && booking.servicios_reserva.length > 0 ? (
                                        booking.servicios_reserva.map(service => (
                                            <span key={service.id} className="service-tag">
                                                Servicio #{service.servicio_id} (x{service.cantidad})
                                            </span>
                                        ))
                                    ) : (
                                        <span className="no-services-tag">Sin servicios adicionales</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Nota informativa actualizada */}
            <div className="info-note">
                <h3>💡 Información Importante</h3>
                <ul>
                    <li>Puedes agregar servicios a <strong>cualquier reserva</strong>, sin importar su estado</li>
                    <li>Los servicios se agregan con cantidad 1 por defecto</li>
                    <li>Puedes agregar múltiples servicios a una misma reserva</li>
                    <li>Los precios mostrados son informativos (el sistema actual no modifica el total)</li>
                </ul>
            </div>
        </div>
    );
};

export default ServicesPage;