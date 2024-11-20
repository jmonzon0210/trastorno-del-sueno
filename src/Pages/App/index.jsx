import { useRoutes, BrowserRouter } from "react-router-dom";
import "./App.css";
import FormPage from "../FormPage";
import Home from "../Home";
import Historial from "../Historial";
import NotFound from "../NotFound";
import NavBar from "../../Components/NavBar";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/form", element: <FormPage /> },
    { path: "/historial", element: <Historial /> },
    { path: "/*", element: <NotFound /> },
  ]);

  return routes;
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <NavBar />
    </BrowserRouter>
  );
}

export default App;
