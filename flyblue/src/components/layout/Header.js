import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    ✈️ FlyBlue
                </Link>

                <nav className="nav">
                    {isAuthenticated ? (
                        <>
                            <Link to="/" className="nav-link">Vuelos</Link>
                            <Link to="/bookings" className="nav-link">Mis Reservas</Link>
                            <Link to="/profile" className="nav-link">Perfil</Link>
                            <div className="user-menu">
                                <span>Hola, {user?.firstName || user?.email?.split('@')[0] || 'Usuario'}</span>
                                <button onClick={handleLogout} className="logout-btn">
                                    Cerrar Sesión
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                            <Link to="/register" className="nav-link register-btn">
                                Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;