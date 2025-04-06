import { useRoutes, BrowserRouter } from "react-router-dom";
import "./App.css";
import FormPage from "../FormPage";
import Home from "../Home";
import Historial from "../Historial";
import NotFound from "../NotFound";
import Login from "../../Components/Login";
import PrivateRoute from "../../Components/PrivateRoute";
import { Analytics } from "@vercel/analytics/react"
import Navbar from "../../Components/Navbar";
import StatsDashboard from "../../Components/Graficos";
import Usuarios from "../../Components/Usuarios";
import { AuthProvider } from "../../context";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },

    // Solo especialistas pueden acceder a estas rutas
    {
      path: "/estadisticas",
      element: <PrivateRoute roles={['Especialista']} component={StatsDashboard} />,
    },
   
    {
      path: "/form",
      element: <PrivateRoute roles={['Especialista']} component={FormPage} />,
    },
    {
      path: "/historial",
      element: <PrivateRoute roles={['Especialista']} component={Historial} />,
    },
    {
      path: "/user-management",
      element: <PrivateRoute roles={['Administrador']} component={Usuarios} />,
    },
    { path: "/*", element: <NotFound /> },
  ]);

  return routes;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
