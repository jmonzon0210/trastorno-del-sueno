import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Input, Table, message, Popconfirm, Form, Select } from "antd";

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

  // 🔥 Cargar la lista de usuarios
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

  // 🔥 Mostrar modal para agregar o editar usuario
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

  // 🔥 Modal para cambiar contraseña
  const showPasswordModal = (user) => {
    setEditingUser(user);
    setIsPasswordModalVisible(true);
    passwordForm.resetFields();
  };

  // 🔥 Agregar o editar usuario
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
      message.error("Error al guardar el usuario.");
    }

    setLoading(false);
  };

  // 🔥 Cambiar la contraseña
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

  // 🔥 Eliminar usuario
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Usuario",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Activo",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (is_active ? "Sí" : "No"),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Acciones",
      render: (_, record) => (
        <>
          <Button
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
            type="primary"
          >
            Editar
          </Button>

          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger style={{ marginRight: 8 }}>Eliminar</Button>
          </Popconfirm>

          <Button
            onClick={() => showPasswordModal(record)}
            style={{ marginRight: 8 }}
          >
            Cambiar Contraseña
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
  
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Agregar Usuario
      </Button>

      <Table
        dataSource={usuarios}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      {/* 🔥 Modal para agregar/editar usuario */}
      <Modal
        title={isEditing ? "Editar Usuario" : "Agregar Usuario"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Usuario" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Contraseña" rules={[{ required: !isEditing }]}>
            <Input.Password placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Ingrese la contraseña"} />
          </Form.Item>

          <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Administrador">Administrador</Select.Option>
              <Select.Option value="Especialista">Especialista</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 🔥 Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onOk={handleChangePassword}
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
