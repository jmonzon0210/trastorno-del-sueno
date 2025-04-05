import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <nav>
        <ul>
          <li>Cargando...</li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      {/* Saludo a la izquierda */}
      <div className="navbar-left">
        {user && <span className="user-greeting">Hola, {user.username}</span>}
      </div>

      {/* Enlaces centrados */}
      <ul className="nav-links">
        {user && user.role === "Especialista" && (
          <>
            <li><Link to="/estadisticas">Estadísticas</Link></li>
            <li><Link to="/form">Evaluar Paciente</Link></li>
            <li><Link to="/historial">Historial</Link></li>
          </>
        )}
        {user && user.role === "Administrador" && (
          <>
            <li><Link to="/user-management">Gestión de Usuarios</Link></li>
          </>
        )}
        <li><Link to="/">Acerca de...</Link></li>
      </ul>

      {/* Botones de autenticación a la derecha */}
      <div className="navbar-right">
        {!user && <Link to="/login">Iniciar Sesión</Link>}
        {user && <button onClick={handleLogout}>Cerrar sesión</button>}
      </div>
    </nav>
  );
};

export default Navbar;
