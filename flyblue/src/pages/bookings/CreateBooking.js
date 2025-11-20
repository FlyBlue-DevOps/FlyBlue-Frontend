import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { flightsService } from '../../services/flights/flightsService';
import { bookingsService } from '../../services/bookings/bookingsService';
import './CreateBooking.css';

const CreateBooking = () => {
    const { flightId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    // Datos de la reserva
    const [bookingData, setBookingData] = useState({
        clase: 'economica',
        asiento: 'A1', // Asiento por defecto (solo se envía 1 al backend)
        total: 0
    });

    // Asientos seleccionados por el usuario (solo para mostrar)
    const [selectedSeatsCount, setSelectedSeatsCount] = useState(1);

    useEffect(() => {
        loadFlightData();
    }, [flightId]);

    const loadFlightData = async () => {
        try {
            setLoading(true);
            const flightData = await flightsService.getFlightById(flightId);
            setFlight(flightData);

            // Calcular total inicial
            const total = flightData.precio_base * selectedSeatsCount;
            setBookingData(prev => ({ ...prev, total }));

        } catch (err) {
            setError('Error al cargar los datos del vuelo');
            console.error('Error loading flight:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSeatCountChange = (count) => {
        setSelectedSeatsCount(count);
        if (flight) {
            const total = flight.precio_base * count;
            setBookingData(prev => ({ ...prev, total }));
        }
    };

    const handleClassChange = (clase) => {
        setBookingData(prev => ({ ...prev, clase }));
    };

    const handleSeatChange = (asiento) => {
        setBookingData(prev => ({ ...prev, asiento }));
    };

    const handleCreateBooking = async () => {
        try {
            setCreating(true);
            setError('');

            // Preparar datos para enviar al backend
            const bookingToSend = {
                vuelo_id: parseInt(flightId),
                clase: bookingData.clase,
                asiento: bookingData.asiento, // Solo enviamos 1 asiento
                total: bookingData.total
            };

            console.log('Creando reserva:', bookingToSend);

            const createdBooking = await bookingsService.createBooking(bookingToSend);

            // Navegar a la página de pago con los datos de la reserva
            navigate(`/payment/${createdBooking.id}`, {
                state: {
                    booking: createdBooking,
                    flight: flight,
                    seatsCount: selectedSeatsCount // Para mostrar en el resumen
                }
            });

        } catch (err) {
            setError('Error al crear la reserva: ' + (err.response?.data?.detail || err.message));
            console.error('Error creating booking:', err);
        } finally {
            setCreating(false);
        }
    };

    // Generar opciones de asientos
    const generateSeatOptions = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
        const seats = [];

        rows.forEach(row => {
            for (let num = 1; num <= 6; num++) {
                seats.push(`${row}${num}`);
            }
        });

        return seats;
    };

    if (loading) {
        return (
            <div className="create-booking-page">
                <div className="loading">Cargando información del vuelo...</div>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="create-booking-page">
                <div className="error-message">Vuelo no encontrado</div>
                <button onClick={() => navigate('/')} className="back-btn">
                    Volver a vuelos
                </button>
            </div>
        );
    }

    return (
        <div className="create-booking-page">
            <div className="booking-header">
                <h1>Completar Reserva</h1>
                <div className="flight-summary">
                    <div className="route">
                        {flight.origen} → {flight.destino}
                    </div>
                    <div className="date">
                        {new Date(flight.salida).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="booking-form">
                <div className="form-section">
                    <h3>Seleccionar Clase</h3>
                    <div className="class-options">
                        {['economica', 'ejecutiva', 'primera'].map(clase => (
                            <label key={clase} className="class-option">
                                <input
                                    type="radio"
                                    name="clase"
                                    value={clase}
                                    checked={bookingData.clase === clase}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                />
                                <span className="class-name">{clase.charAt(0).toUpperCase() + clase.slice(1)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Número de Asientos</h3>
                    <div className="seat-count">
                        <select
                            value={selectedSeatsCount}
                            onChange={(e) => handleSeatCountChange(parseInt(e.target.value))}
                            className="seat-count-select"
                        >
                            {[...Array(Math.min(flight.asientos_disponibles, 10)).keys()].map(num => (
                                <option key={num + 1} value={num + 1}>
                                    {num + 1} asiento{num + 1 > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                        <small className="note">
                            * Nota: El sistema actual solo permite reservar 1 asiento por transacción
                        </small>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Seleccionar Asiento</h3>
                    <div className="seat-selection">
                        <label>Asiento principal:</label>
                        <select
                            value={bookingData.asiento}
                            onChange={(e) => handleSeatChange(e.target.value)}
                            className="seat-select"
                        >
                            {generateSeatOptions().map(seat => (
                                <option key={seat} value={seat}>
                                    {seat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="price-summary">
                    <h3>Resumen de Precio</h3>
                    <div className="price-details">
                        <div className="price-row">
                            <span>Precio por asiento:</span>
                            <span>${flight.precio_base.toLocaleString()}</span>
                        </div>
                        <div className="price-row">
                            <span>Asientos seleccionados:</span>
                            <span>{selectedSeatsCount}</span>
                        </div>
                        <div className="price-row total">
                            <span>Total a pagar:</span>
                            <span>${bookingData.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="booking-actions">
                    <button
                        onClick={() => navigate(-1)}
                        className="cancel-btn"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreateBooking}
                        disabled={creating || flight.asientos_disponibles === 0}
                        className="confirm-btn"
                    >
                        {creating ? 'Creando Reserva...' : 'Continuar al Pago'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBooking;