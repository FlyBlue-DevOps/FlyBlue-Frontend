import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth/authService';

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
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, contrasena) => {
        try {
            const data = await authService.login(email, contrasena);

            // Guardar el token y tipo de token
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('token_type', data.token_type);

            // Como el login solo devuelve el token, necesitamos obtener los datos del usuario
            const userData = {
                email: email,
                // Podemos agregar más datos cuando tengamos un endpoint para obtener el perfil
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (error) {
            // Manejar diferentes formatos de error
            let errorMessage = 'Error al iniciar sesión';

            if (error.response?.data?.detail) {
                // Si es un array de errores, tomar el primer mensaje
                if (Array.isArray(error.response.data.detail)) {
                    errorMessage = error.response.data.detail[0]?.msg || errorMessage;
                } else if (typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data.detail.msg) {
                    errorMessage = error.response.data.detail.msg;
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const register = async (userData) => {
        try {
            // Ajustar los datos para que coincidan con el esquema del backend
            const registerData = {
                id: parseInt(userData.id), // Convertir a número si el backend lo espera como integer
                nombre: userData.firstName,
                email: userData.email,
                contrasena: userData.password,
                rol: "cliente" // Siempre será cliente
            };

            console.log('Datos enviados al registrar:', registerData);

            const data = await authService.register(registerData);

            // Después del registro, hacer login automáticamente si devuelve token
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('token_type', data.token_type);

                const userData = {
                    id: registerData.id,
                    email: registerData.email,
                    nombre: registerData.nombre
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            }

            return { success: true };
        } catch (error) {
            // Manejar diferentes formatos de error
            let errorMessage = 'Error al registrar usuario';

            console.log('Error completo del registro:', error.response?.data);

            if (error.response?.data?.detail) {
                // Si es un array de errores, tomar el primer mensaje
                if (Array.isArray(error.response.data.detail)) {
                    errorMessage = error.response.data.detail[0]?.msg || errorMessage;
                } else if (typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data.detail.msg) {
                    errorMessage = error.response.data.detail.msg;
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
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

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};