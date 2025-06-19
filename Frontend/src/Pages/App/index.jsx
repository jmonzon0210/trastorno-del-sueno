import { useRoutes, BrowserRouter } from "react-router-dom";
import "./App.css";
import FormPage from "../FormPage";
import LoginPage from "../LoginPage";
import UsersPage from "../UsersPage";
import Home from "../Home";
import PrivateRoute from "../../Components/PrivateRoute";
import { AuthProvider } from "../../context";
import NotFoundPage from "../NotFoundPage";
import GraphsPage from "../GraphsPage";
import HistPage from "../HistPage";
import ReentrenarModeloPage from "../ReentrenarModeloPage";


const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/login", element: <LoginPage /> },

    // Solo especialistas pueden acceder a estas rutas
    {
      path: "/estadisticas",
      element: <PrivateRoute roles={['Especialista']} component={GraphsPage} />,
    },
   
    {
      path: "/form",
      element: <PrivateRoute roles={['Especialista']} component={FormPage} />,
    },
    {
      path: "/historial",
      element: <PrivateRoute roles={['Especialista']} component={HistPage} />,
    },
    {
      path: "/user-management",
      element: <PrivateRoute roles={['Administrador']} component={UsersPage} />,
    },
    {
      path: "/reentrenar-modelo",
      element: <PrivateRoute roles={['Administrador']} component={ReentrenarModeloPage} />,
    },
    { path: "/*", element: <NotFoundPage /> },
  ]);

  return routes;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
