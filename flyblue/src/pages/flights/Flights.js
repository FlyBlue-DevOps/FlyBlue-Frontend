import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { flightsService } from '../../services/flights/flightsService';
import './Flights.css';

const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState({
        origen: '',
        destino: ''
    });

    useEffect(() => {
        loadFlights();
    }, []);

    const loadFlights = async () => {
        try {
            setLoading(true);
            const data = await flightsService.getAllFlights();
            setFlights(data);
        } catch (err) {
            setError('Error al cargar los vuelos disponibles');
            console.error('Error loading flights:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Filtrar vuelos localmente
    const filteredFlights = flights.filter(flight => {
        if (filters.origen && flight.origen !== filters.origen) return false;
        if (filters.destino && flight.destino !== filters.destino) return false;
        return true;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <div className="flights-page">
                <div className="loading">Cargando vuelos disponibles...</div>
            </div>
        );
    }

    return (
        <div className="flights-page">
            <h1>Vuelos Disponibles</h1>

            {/* Filtros */}
            <div className="filters-section">
                <h3>Filtrar Vuelos</h3>
                <div className="filter-row">
                    <div className="filter-group">
                        <label>Origen:</label>
                        <select
                            name="origen"
                            value={filters.origen}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos los orígenes</option>
                            <option value="Ibagué">Ibagué</option>
                            <option value="Medellín">Medellín</option>
                            <option value="Cartagena">Cartagena</option>
                            <option value="Santa Marta">Santa Marta</option>
                            <option value="Cali">Cali</option>
                            <option value="San Andrés">San Andrés</option>
                            <option value="Bogotá">Bogotá</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Destino:</label>
                        <select
                            name="destino"
                            value={filters.destino}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos los destinos</option>
                            <option value="Ibagué">Ibagué</option>
                            <option value="Medellín">Medellín</option>
                            <option value="Cartagena">Cartagena</option>
                            <option value="Santa Marta">Santa Marta</option>
                            <option value="Cali">Cali</option>
                            <option value="San Andrés">San Andrés</option>
                            <option value="Bogotá">Bogotá</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Lista de Vuelos */}
            <div className="flights-list">
                {filteredFlights.length === 0 ? (
                    <div className="no-flights">
                        No se encontraron vuelos disponibles
                    </div>
                ) : (
                    filteredFlights.map(flight => (
                        <div key={flight.id} className="flight-card">
                            <div className="flight-header">
                                <div className="flight-route">
                                    <div className="route-city">
                                        <span className="city-code">{getCityCode(flight.origen)}</span>
                                        <span className="city-name">{flight.origen}</span>
                                    </div>
                                    <div className="route-arrow">→</div>
                                    <div className="route-city">
                                        <span className="city-code">{getCityCode(flight.destino)}</span>
                                        <span className="city-name">{flight.destino}</span>
                                    </div>
                                </div>
                                <div className="flight-price">
                                    ${flight.precio_base.toLocaleString()}
                                </div>
                            </div>

                            <div className="flight-details">
                                <div className="detail-group">
                                    <span className="detail-label">Salida:</span>
                                    <span className="detail-value">{formatDate(flight.salida)}</span>
                                </div>
                                <div className="detail-group">
                                    <span className="detail-label">Llegada:</span>
                                    <span className="detail-value">{formatDate(flight.llegada)}</span>
                                </div>
                                <div className="detail-group">
                                    <span className="detail-label">Duración:</span>
                                    <span className="detail-value">{formatDuration(flight.duracion)}</span>
                                </div>
                                <div className="detail-group">
                                    <span className="detail-label">Asientos disponibles:</span>
                                    <span className="detail-value">{flight.asientos_disponibles}</span>
                                </div>
                            </div>

                            <div className="flight-actions">
                                <Link
                                    to={`/flight/${flight.id}`}
                                    className="reserve-btn"
                                >
                                    Reservar Vuelo
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Función helper para obtener códigos de ciudades (opcional, para mostrar)
const getCityCode = (cityName) => {
    const cities = {
        'Ibagué': 'IBG',
        'Medellín': 'MDE',
        'Cartagena': 'CTG',
        'Santa Marta': 'SMR',
        'Cali': 'CLO',
        'San Andrés': 'ADZ',
        'Bogotá': 'BOG'
    };
    return cities[cityName] || cityName.substring(0, 3).toUpperCase();
};

export default Flights;