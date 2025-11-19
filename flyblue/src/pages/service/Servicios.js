import React, { useEffect, useState } from "react";
import { getServicios, deleteServicio } from "../../services/servicioService";
import { useAuth } from "../../contexts/AuthContext";
import "./Servicios.css";

const Servicios = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [servicios, setServicios] = useState([]);
    const [message, setMessage] = useState("");

    const cargarServicios = async () => {
        try {
            const data = await getServicios();
            setServicios(data);
        } catch (error) {
            console.error(error);
            setMessage("Error al cargar los servicios");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este servicio?")) return;

        try {
            await deleteServicio(id);
            setMessage("Servicio eliminado correctamente");
            cargarServicios();
        } catch (error) {
            console.error(error);
            setMessage("Error al eliminar el servicio");
        }
    };

    useEffect(() => {
        cargarServicios();
    }, []);

    return (
        <div className="servicios-page">
            <h1>Servicios Disponibles</h1>

            {message && (
                <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
                    {message}
                </div>
            )}

            {isAdmin && (
                <button className="create-btn">
                    Crear Nuevo Servicio
                </button>
            )}

            <div className="servicios-grid">
                {servicios.map((s) => (
                    <div key={s.id} className="servicio-card">
                        <h3>{s.nombre}</h3>
                        <p className="descripcion">{s.descripcion}</p>
                        <p className="precio">{s.precio} €</p>

                        {isAdmin && (
                            <div className="card-actions">
                                <button className="edit-btn">Editar</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(s.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Servicios;
