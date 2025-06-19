import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context";
import { Form, Input, Button, Typography, message, Card } from "antd";
import logo from "../../assets/login.png"



const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          username: values.username,
          password: values.password,
        },
        { withCredentials: true }
      );

      setUser({ ...response.data, isAuthenticated: true });

      const userRole = response.data.role;
      if (userRole === "Administrador") {
        navigate("/user-management");
      } else if (userRole === "Especialista") {
        navigate("/estadisticas");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          message.error("Usuario o contraseña incorrectos.");
        } else if (err.response.status === 500) {
          message.error("Error interno del servidor. Intente más tarde.");
        } else {
          message.error(
            `Error: ${err.response.data?.detail || "Algo salió mal."}`
          );
        }
      } else if (err.request) {
        message.error("No se pudo conectar al servidor.");
      } else {
        message.error("Error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex items-center justify-center bg-gray-100 px-4 py-12 h-full">
        <div className="w-full max-w-md">
          <Card bordered={false} className="rounded-xl shadow-md p-6 bg-white">
            <div className="flex flex-col items-center mb-6">
              <img src={logo} alt="Logo" className="w-20 h-20 mb-2" />
              <Title level={3} className="!mb-0">Iniciar sesión</Title>
            </div>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Usuario"
                name="username"
                rules={[{ required: true, message: "Ingrese su nombre de usuario" }]}
              >
                <Input placeholder="Usuario" />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[{ required: true, message: "Ingrese su contraseña" }]}
              >
                <Input.Password placeholder="Contraseña" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full"
                >
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
  );
};

export default Login;
