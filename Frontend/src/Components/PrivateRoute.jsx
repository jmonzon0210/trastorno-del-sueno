import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context";
import Loading from "./Loading"; 

const PrivateRoute = ({ roles, component: Component }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/token/refresh/", { withCredentials: true })
      .then(() => {
        console.log("Token refrescado con éxito");
        return axios.get("http://localhost:8000/api/user/", { withCredentials: true });
      })
      .then((response) => {
        console.log("Datos del usuario obtenidos:", response.data);
        setUser({
          username: response.data.username,
          role: response.data.role,
          id: response.data.id,
          isAuthenticated: true,
        });
      })
      .catch(() => {
        console.error("Error al refrescar token");
        setUser((prev) => ({ ...prev, isAuthenticated: false }));
      })
      .finally(() => setLoading(false));
  }, [setUser]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh" 
      }}>
        <Loading />
      </div>
    );
  }

  if (!loading && (!user || !user.isAuthenticated)) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  console.log("Renderizando componente en PrivateRoute");

  // Renderiza el componente protegido
  return <Component />;
};

export default PrivateRoute;
