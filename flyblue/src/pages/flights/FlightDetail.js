import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { flightsService } from '../../services/flights/flightsService';
import './FlightDetail.css';

const FlightDetail = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSeats, setSelectedSeats] = useState(1);

    // Usar useCallback para memoizar la función
    const loadFlightDetail = useCallback(async () => {
        try {
            setLoading(true);
            const data = await flightsService.getFlightById(flightId);
            setFlight(data);
        } catch (err) {
            setError('Error al cargar los detalles del vuelo');
            console.error('Error loading flight details:', err);
        } finally {
            setLoading(false);
        }
    }, [flightId]); // Dependencia: flightId

    useEffect(() => {
        loadFlightDetail();
    }, [loadFlightDetail]); // Ahora loadFlightDetail es estable


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleSeatChange = (e) => {
        const seats = parseInt(e.target.value);
        setSelectedSeats(seats);
    };

    const handleReserve = () => {
        // Navegar a la página de reserva con los datos del vuelo y asientos seleccionados
        navigate(`/booking/${flightId}`, {
            state: {
                flight,
                seats: selectedSeats,
                totalPrice: flight.precio_base * selectedSeats
            }
        });
    };

    if (loading) {
        return (
            <div className="flight-detail-page">
                <div className="loading">Cargando detalles del vuelo...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flight-detail-page">
                <div className="error-message">{error}</div>
                <Link to="/" className="back-link">← Volver a vuelos</Link>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="flight-detail-page">
                <div className="error-message">Vuelo no encontrado</div>
                <Link to="/" className="back-link">← Volver a vuelos</Link>
            </div>
        );
    }

    return (
        <div className="flight-detail-page">
            <Link to="/" className="back-link">← Volver a vuelos</Link>

            <div className="flight-detail-card">
                <div className="flight-header">
                    <h1>Reservar Vuelo</h1>
                    <div className="flight-route-large">
                        <div className="route-section">
                            <div className="city-code">{flight.origin}</div>
                            <div className="city-name">{getCityName(flight.origin)}</div>
                        </div>
                        <div className="route-separator">
                            <div className="duration">{formatDuration(flight.duracion)}</div>
                            <div className="line">━━━━━━━━━━</div>
                        </div>
                        <div className="route-section">
                            <div className="city-code">{flight.destino}</div>
                            <div className="city-name">{getCityName(flight.destino)}</div>
                        </div>
                    </div>
                </div>

                <div className="flight-info-grid">
                    <div className="info-section">
                        <h3>Información del Vuelo</h3>
                        <div className="info-row">
                            <span className="info-label">Salida:</span>
                            <span className="info-value">{formatDate(flight.salida)}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Llegada:</span>
                            <span className="info-value">{formatDate(flight.llegada)}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Duración:</span>
                            <span className="info-value">{formatDuration(flight.duracion)}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Asientos disponibles:</span>
                            <span className="info-value">{flight.asientos_disponibles}</span>
                        </div>
                    </div>

                    <div className="booking-section">
                        <h3>Seleccionar Asientos</h3>
                        <div className="seat-selection">
                            <label htmlFor="seats">Número de asientos:</label>
                            <select
                                id="seats"
                                value={selectedSeats}
                                onChange={handleSeatChange}
                                className="seat-select"
                            >
                                {[...Array(Math.min(flight.asientos_disponibles, 10)).keys()].map(num => (
                                    <option key={num + 1} value={num + 1}>
                                        {num + 1} asiento{num + 1 > 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="price-summary">
                            <div className="price-row">
                                <span>Precio por asiento:</span>
                                <span>${flight.precio_base.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span>Asientos seleccionados:</span>
                                <span>{selectedSeats}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total:</span>
                                <span>${(flight.precio_base * selectedSeats).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleReserve}
                            className="reserve-now-btn"
                            disabled={flight.asientos_disponibles === 0}
                        >
                            {flight.asientos_disponibles === 0 ? 'No hay asientos disponibles' : 'Continuar con la Reserva'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Función helper para obtener nombres de ciudades
const getCityName = (code) => {
    const cities = {
        'IBG': 'Ibagué',
        'MDE': 'Medellín',
        'CTG': 'Cartagena',
        'SMR': 'Santa Marta',
        'CLO': 'Cali',
        'ADZ': 'San Andrés'
    };
    return cities[code] || code;
};

export default FlightDetail;