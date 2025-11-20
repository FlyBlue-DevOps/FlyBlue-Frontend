import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth/authService';
import { getUserIdFromToken, decodeJWT } from '../utils/jwtUtils'; // Importar las nuevas funciones

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeUser();
    }, []);

    const initializeUser = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded) {
                const userData = {
                    id: decoded.id, // La cédula viene del token
                    email: decoded.sub,
                    rol: decoded.rol,
                    nombre: decoded.nombre || 'Usuario'
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
        }
        setLoading(false);
    };

    const login = async (email, contrasena) => {
        try {
            const data = await authService.login(email, contrasena);

            // Guardar el token
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('token_type', data.token_type);

            // Decodificar el token para obtener los datos del usuario
            const decoded = decodeJWT(data.access_token);
            if (decoded) {
                const userData = {
                    id: decoded.id, // Cédula del token
                    email: decoded.sub,
                    rol: decoded.rol,
                    nombre: decoded.nombre || email.split('@')[0]
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            }

            return { success: true };
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';

            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    errorMessage = error.response.data.detail[0]?.msg || errorMessage;
                } else if (typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                }
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const register = async (userData) => {
        try {
            const registerData = {
                id: parseInt(userData.id),
                nombre: userData.firstName,
                email: userData.email,
                contrasena: userData.password,
                rol: "cliente"
            };

            const data = await authService.register(registerData);

            // Guardar token después del registro
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('token_type', data.token_type);

                // Decodificar token para obtener datos
                const decoded = decodeJWT(data.access_token);
                if (decoded) {
                    const userInfo = {
                        id: decoded.id,
                        email: decoded.sub,
                        rol: decoded.rol,
                        nombre: registerData.nombre
                    };
                    localStorage.setItem('user', JSON.stringify(userInfo));
                    setUser(userInfo);
                }
            }

            return { success: true };
        } catch (error) {
            let errorMessage = 'Error al registrar usuario';

            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    errorMessage = error.response.data.detail[0]?.msg || errorMessage;
                } else if (typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                }
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const getUserId = () => {
        return getUserIdFromToken(); // Ahora obtenemos la cédula directamente del token
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        getUserId
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};