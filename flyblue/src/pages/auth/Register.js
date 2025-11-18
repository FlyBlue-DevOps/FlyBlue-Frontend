import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        id: '', // Cedula
        nombre: '',
        email: '',
        contrasena: '',
        confirmContrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (!formData.id) {
            setError('La cédula es requerida');
            setLoading(false);
            return;
        }

        if (formData.contrasena !== formData.confirmContrasena) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        const userData = {
            id: formData.id, // Cedula
            firstName: formData.nombre, // Se mapeará a "nombre" en el contexto
            email: formData.email,
            password: formData.contrasena // Se mapeará a "contrasena" en el contexto
        };

        console.log('Datos del formulario:', userData);

        const result = await register(userData);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Crear Cuenta</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>Cédula:</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        required
                        placeholder="Tu número de cédula"
                    />
                </div>

                <div className="form-group">
                    <label>Nombre completo:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre completo"
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="usuario@ejemplo.com"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                            placeholder="Mínimo 6 caracteres"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar Contraseña:</label>
                        <input
                            type="password"
                            name="confirmContrasena"
                            value={formData.confirmContrasena}
                            onChange={handleChange}
                            required
                            placeholder="Repite tu contraseña"
                            minLength="6"
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>

                <p>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;