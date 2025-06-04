import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Input, message, Popconfirm, Form, Select, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Tabla from "../Tabla";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  

  const API_URL = "http://localhost:8000/api/usuarios/";

  //  Cargar la lista de usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      setUsuarios(response.data);
    } catch (error) {
      message.error("Error al cargar los usuarios.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  //  Mostrar modal para agregar o editar usuario
  const showModal = (user = null) => {
    setIsEditing(!!user);
    setEditingUser(user);
    setIsModalVisible(true);

    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } else {
      form.resetFields();
    }
  };

  //  Modal para cambiar contraseña
  const showPasswordModal = (user) => {
    setEditingUser(user);
    setIsPasswordModalVisible(true);
    passwordForm.resetFields();
  };

  //  Agregar o editar usuario
  const handleSubmit = async () => {
    const values = await form.validateFields();
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${API_URL}${editingUser.id}/editar/`, values, { withCredentials: true });
        message.success("Usuario actualizado con éxito");
      } else {
        await axios.post(`${API_URL}crear/`, values, { withCredentials: true });
        message.success("Usuario creado con éxito");
      }
      fetchUsuarios();
      setIsModalVisible(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
      message.error(error.response.data.error);
    } else {
      message.error("Error al guardar el usuario.");
    }
  }

    setLoading(false);
  };

  // Cambiar la contraseña
  const handleChangePassword = async () => {
    const values = await passwordForm.validateFields();
    setLoading(true);

    try {
      await axios.post(`${API_URL}${editingUser.id}/cambiar-contrasena/`, {
        password: values.password,
      }, { withCredentials: true });

      message.success("Contraseña cambiada con éxito");
      setIsPasswordModalVisible(false);
    } catch (error) {
      message.error("Error al cambiar la contraseña.");
    }
    setLoading(false);
  };

  //  Eliminar usuario
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}${id}/eliminar/`, { withCredentials: true });
      message.success("Usuario eliminado con éxito");
      fetchUsuarios();
    } catch (error) {
      message.error("Error al eliminar el usuario.");
    }
    setLoading(false);
  };

  const menuAcciones = (record) => (
    <Menu>
      <Menu.Item key="editar" onClick={() => showModal(record)}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ModeEditIcon style={{ fontSize: 18, color: "#1890ff" }} />
        Editar
      </span>
      </Menu.Item>
      <Menu.Item key="cambiar_contrasena" onClick={() => showPasswordModal(record)}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ChangeCircleIcon style={{ fontSize: 18, color: "#1890ff" }} />
        Cambiar contraseña
      </span>
      </Menu.Item>
      <Menu.Item key="eliminar">
        <Popconfirm
          title="¿Estás seguro de eliminar este usuario?"
          onConfirm={() => handleDelete(record.id)}
          okText="Sí"
          cancelText="No"
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <DeleteIcon style={{ fontSize: 18, color: "#ff4d4f" }} />
        Eliminar
      </span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Usuario", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Activo", dataIndex: "is_active", key: "is_active", render: (is_active) => (is_active ? "Sí" : "No") },
    { title: "Rol", dataIndex: "role", key: "role" },
    {
    title: "Fecha de creación",
    dataIndex: "date_joined",
    key: "date_joined",
    render: (text) => text ? new Date(text).toLocaleString() : "",
  },
    {
      title: "",
      key: "acciones",
      fixed: "right",
      render: (_, record) => (
        <Dropdown overlay={menuAcciones(record)} trigger={['click']}>
          <Button
            shape="circle"
            icon={<MoreOutlined style={{ fontSize: 20, color: "#555" }} />}
            style={{
              background: "#f0f0f0",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PersonAddIcon style={{ fontSize: 18, color: "#FFFFFF" }} />
          Agregar Usuario
        </span>
      </Button>

      <Tabla
         columns={columns}
         dataSource={usuarios}
         loading={loading}
      />

      {/*  Modal para agregar/editar usuario */}
      <Modal
        title={isEditing ? "Editar Usuario" : "Agregar Usuario"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Usuario"  rules={[{ required: true, message: "Ingrese el nombre de usuario" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{type: 'email', message: 'El correo no es válido' }]}>
            <Input/>
          </Form.Item>

          <Form.Item name="password" label="Contraseña" rules={[{ required: !isEditing, message: "Ingrese la contraseña" }]}>
            <Input.Password placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Ingrese la contraseña"} />
          </Form.Item>

          <Form.Item name="role" label="Rol"  rules={[{ required: true, message: "Seleccione el rol del usuario" }]}>
            <Select>
              <Select.Option value="Administrador">Administrador</Select.Option>
              <Select.Option value="Especialista">Especialista</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onOk={handleChangePassword}
        okText="Cambiar"
        cancelText="Cancelar"
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label="Nueva Contraseña"
            rules={[{ required: true, message: "Ingrese la nueva contraseña" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Usuarios;
