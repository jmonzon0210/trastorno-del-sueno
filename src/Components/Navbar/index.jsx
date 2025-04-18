import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { Menu, X } from "lucide-react"; // iconos


const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cerrar sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <nav className="p-4 bg-gray-800 text-white">
        <ul>
          <li>Cargando...</li>
        </ul>
      </nav>
    );
  }

  return (
    <>
      {/* Navbar superior en pantallas pequeñas */}
      <nav className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white md:hidden">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar}>
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          {user && <span>Hola, {user.username}</span>}
        </div>
        <div>
          {user ? (
            <button onClick={handleLogout}>Cerrar sesión</button>
          ) : (
            <Link to="/login">Iniciar sesión</Link>
          )}
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"></div>
      )}

      {/* Sidebar responsive */}
      {sidebarOpen && (
        <div
          ref={sidebarRef}
          className="md:hidden fixed top-0 left-0 w-64 h-full bg-gray-900 text-white shadow-lg z-50 p-6 transition-transform"
        >
          <div className="flex justify-end mb-4">
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <ul className="flex flex-col gap-4">
            {user?.role === "Especialista" && (
              <>
                <li>
                  <Link to="/estadisticas" onClick={toggleSidebar}>
                    Estadísticas
                  </Link>
                </li>
                <li>
                  <Link to="/form" onClick={toggleSidebar}>
                    Evaluar Paciente
                  </Link>
                </li>
                <li>
                  <Link to="/historial" onClick={toggleSidebar}>
                    Historial
                  </Link>
                </li>
              </>
            )}
            {user?.role === "Administrador" && (
              <li>
                <Link to="/user-management" onClick={toggleSidebar}>
                  Gestión de Usuarios
                </Link>
              </li>
            )}
            <li>
              <Link to="/" onClick={toggleSidebar}>
                Acerca de...
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Navbar completa en pantallas grandes */}
      <nav className="hidden md:flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
        <div>{user && <span className="user-greeting">Hola, {user.username}</span>}</div>
        <ul className="flex gap-6">
          {user?.role === "Especialista" && (
            <>
              <li><Link to="/estadisticas">Estadísticas</Link></li>
              <li><Link to="/form">Evaluar Paciente</Link></li>
              <li><Link to="/historial">Historial</Link></li>
            </>
          )}
          {user?.role === "Administrador" && (
            <li><Link to="/user-management">Gestión de Usuarios</Link></li>
          )}
          <li><Link to="/">Acerca de...</Link></li>
        </ul>
        <div>
          {!user && <Link to="/login">Iniciar Sesión</Link>}
          {user && <button onClick={handleLogout}>Cerrar sesión</button>}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
