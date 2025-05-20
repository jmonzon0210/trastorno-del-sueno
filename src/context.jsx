// context.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primero intenta refrescar el token
        await axios.get("http://localhost:8000/api/token/refresh/", { withCredentials: true });
        // Si el refresh es exitoso, obtén los datos del usuario
        const response = await axios.get("http://localhost:8000/api/user/", { withCredentials: true });
        setUser({ ...response.data, isAuthenticated: true });
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setUser(null); // Si falla el refresh o la obtención del usuario, no hay sesión
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      // Llama al endpoint de logout para invalidar tokens y eliminar cookies
      await axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true });
      setUser(null); // Limpia el estado del usuario
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setUser(null); // Limpia el estado incluso si falla la solicitud
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
