import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { Menu, X } from "lucide-react"; // iconos
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

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
          {user && <span>Hola, {user.role}</span>}
        </div>
       <div>
          {!user && <NavLink to="/login"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "nav-link-active" : ""}`
                      }
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <LoginIcon style={{ fontSize: 18, color: "#ffffff" }} />
                        Iniciar sesión
                      </span>
                    </NavLink>}
          {user && (
                    <NavLink
                      to="/login"
                      onClick={handleLogout}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "nav-link-active" : ""}`
                      }
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <LogoutIcon style={{ fontSize: 18, color: "#ffffff" }} />
                        Cerrar sesión
                      </span>
                    </NavLink>
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
                  <NavLink to="/estadisticas" onClick={toggleSidebar}
                   className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                  >
                    Estadísticas
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/form" onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                  >
                    Evaluar Paciente
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/historial" onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                  >
                    Gestionar Pacientes
                  </NavLink>
                </li>
              </>
            )}
            {user?.role === "Administrador" && (
              <>
              <li>
                <NavLink to="/user-management" onClick={toggleSidebar}
                className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                  >
                  Gestión de Usuarios
                </NavLink>
              </li>
              <li>
                <NavLink to="/reentrenar-modelo" onClick={toggleSidebar}
                className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                  >
                  Reentrenar modelo de IA
                </NavLink>
              </li>
              </>
            )}
            <li>
              <NavLink to="/" onClick={toggleSidebar}
              className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                  >
                Acerca de...
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      {/* Navbar completa en pantallas grandes */}
      <nav className="hidden md:flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
        <div>{user && <span className="user-greeting">Hola, {user.role}</span>}</div>
        <ul className="flex gap-6">
  {user?.role === "Especialista" && (
    <>
      <li>
        <NavLink
          to="/estadisticas"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link-active" : ""}`
          }
        >
          Estadísticas
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/form"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link-active" : ""}`
          }
        >
          Evaluar Paciente
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/historial"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link-active" : ""}`
          }
        >
          Gestionar Pacientes
        </NavLink>
      </li>
    </>
  )}
  {user?.role === "Administrador" && (
    <>
      <li>
        <NavLink
          to="/user-management"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link-active" : ""}`
          }
        >
          Gestión de Usuarios
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/reentrenar-modelo"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link-active" : ""}`
          }
        >
          Reentrenar Modelo de IA
        </NavLink>
      </li>
    </>
  )}
  <li>
    <NavLink
      to="/"
      className={({ isActive }) =>
        `nav-link ${isActive ? "nav-link-active" : ""}`
      }
    >
      Acerca de...
    </NavLink>
  </li>
</ul>
        <div>
          {!user && <NavLink to="/login"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "nav-link-active" : ""}`
                      }
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <LoginIcon style={{ fontSize: 18, color: "#ffffff" }} />
                        Iniciar sesión
                      </span>
                    </NavLink>}
          {user && (
                    <NavLink
                      to="/login"
                      onClick={handleLogout}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "nav-link-active" : ""}`
                      }
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <LogoutIcon style={{ fontSize: 18, color: "#ffffff" }} />
                        Cerrar sesión
                      </span>
                    </NavLink>
                  )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
