import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; 2025 FlyBlue. Todos los derechos reservados.</p>
                <div className="footer-links">
                    <a href="#terms">Términos y Condiciones</a>
                    <a href="#privacy">Política de Privacidad</a>
                    <a href="#contact">Contacto</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;