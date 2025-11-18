import React, { useState, useEffect } from 'react';
import { flightsService } from '../../services/flights/flightsService';
import './Flights.css';

const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchParams, setSearchParams] = useState({
        origin: '',
        destination: '',
        date: ''
    });

    useEffect(() => {
        loadAvailableFlights();
    }, []);

    const loadAvailableFlights = async () => {
        try {
            setLoading(true);
            const data = await flightsService.getAvailableFlights();
            setFlights(data);
        } catch (err) {
            setError('Error al cargar los vuelos disponibles');
            console.error('Error loading flights:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await flightsService.searchFlights(searchParams);
            setFlights(data);
        } catch (err) {
            setError('Error al buscar vuelos');
            console.error('Error searching flights:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookFlight = (flightId) => {
        // Navegar a la página de reserva
        console.log('Booking flight:', flightId);
        // navigate(`/book-flight/${flightId}`);
    };

    if (loading) {
        return <div className="loading">Cargando vuelos disponibles...</div>;
    }

    return (
        <div className="flights-page">
            <h1>Vuelos Disponibles</h1>

            {/* Formulario de Búsqueda */}
            <form onSubmit={handleSearch} className="search-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Origen:</label>
                        <select
                            name="origin"
                            value={searchParams.origin}
                            onChange={handleSearchChange}
                        >
                            <option value="">Todos los orígenes</option>
                            <option value="IBG">Ibagué (IBG)</option>
                            <option value="MDE">Medellín (MDE)</option>
                            <option value="CTG">Cartagena (CTG)</option>
                            <option value="SMR">Santa Marta (SMR)</option>
                            <option value="CLO">Cali (CLO)</option>
                            <option value="ADZ">San Andrés (ADZ)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Destino:</label>
                        <select
                            name="destination"
                            value={searchParams.destination}
                            onChange={handleSearchChange}
                        >
                            <option value="">Todos los destinos</option>
                            <option value="IBG">Ibagué (IBG)</option>
                            <option value="MDE">Medellín (MDE)</option>
                            <option value="CTG">Cartagena (CTG)</option>
                            <option value="SMR">Santa Marta (SMR)</option>
                            <option value="CLO">Cali (CLO)</option>
                            <option value="ADZ">San Andrés (ADZ)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Fecha:</label>
                        <input
                            type="date"
                            name="date"
                            value={searchParams.date}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <button type="submit" className="search-btn">
                    Buscar Vuelos
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {/* Lista de Vuelos */}
            <div className="flights-list">
                {flights.length === 0 ? (
                    <div className="no-flights">
                        No se encontraron vuelos disponibles
                    </div>
                ) : (
                    flights.map(flight => (
                        <div key={flight.id} className="flight-card">
                            <div className="flight-info">
                                <div className="route">
                                    <span className="city">{flight.originCity} ({flight.origin})</span>
                                    <span className="arrow">→</span>
                                    <span className="city">{flight.destinationCity} ({flight.destination})</span>
                                </div>
                                <div className="flight-details">
                                    <span>Salida: {new Date(flight.departureTime).toLocaleString()}</span>
                                    <span>Llegada: {new Date(flight.arrivalTime).toLocaleString()}</span>
                                    <span>Precio: ${flight.price}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleBookFlight(flight.id)}
                                className="book-btn"
                            >
                                Reservar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Flights;