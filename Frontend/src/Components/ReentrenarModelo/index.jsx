import React, { useEffect, useState } from "react";
import { Button, message, Modal, Popconfirm, Table, Dropdown, Menu, DatePicker, Space } from "antd";
import { MoreOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import Tabla from "../Tablas/Tabla";
import DetalleModal from "./DetalleModal";
import dayjs from "dayjs";


export default function ReentrenarModelo() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [noReentrenados, setNoReentrenados] = useState(0);


  const columns = [
  {
    title: "Fecha y Hora",
    dataIndex: "timestamp",
    key: "timestamp",
    render: (text) => new Date(text).toLocaleString(),
  },
  {
    title: "Usuario",
    dataIndex: "usuario",
    key: "usuario",
  },
  {
    title: "Total Pacientes",
    dataIndex: "total_pacientes",
    key: "total_pacientes",
  },
   {
      title: "Accuracy",
      dataIndex: "accuracy",
      key: "accuracy",
      render: (value) => {
        const num = Number(value);
        if (isNaN(num)) return "-";
        return (num * 100).toFixed(2) + " %";
      },
    },
  {
    title: "",
    key: "acciones",
    render: (_, record) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="reporte" onClick={() => record.onShowModal("reporte")}>
              Ver reporte de clasificación
            </Menu.Item>
            <Menu.Item key="matriz" onClick={() => record.onShowModal("matriz")}>
              Ver matriz de confusión
            </Menu.Item>
            <Menu.Item key="importancia" onClick={() => record.onShowModal("importancia")}>
              Ver top 5 características
            </Menu.Item>
          </Menu>
        }
        trigger={['click']}
      >
        <Button
          shape="circle"
          icon={<MoreOutlined />}
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


  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/retrain_logs/", { withCredentials: true });
      const logsWithActions = response.data.map((log) => ({
        ...log,
        onShowModal: (type) => {
          setModalType(type);
          setModalData(log);
          setModalVisible(true);
        },
      }));
      setLogs(logsWithActions);
      setFilteredLogs(logsWithActions);
    } catch {
      message.error("No se pudieron cargar los logs de reentrenamiento.");
    }
    setLoading(false);
  };

  // Nueva función para actualizar el número de pacientes no reentrenados
const fetchNoReentrenados = () => {
  axios.get("http://localhost:8000/api/pacientes_no_reentrenados/", { withCredentials: true })
    .then(res => {
      setNoReentrenados(res.data.nuevos_pacientes || 0);
    })
    .catch(() => {
      setNoReentrenados(0);
    });
};

  useEffect(() => {
    fetchLogs();
    fetchNoReentrenados();
  }, []);

  // Filtrar por fecha
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!date) {
      setFilteredLogs(logs);
      return;
    }
    const selected = dayjs(date).format("YYYY-MM-DD");
    setFilteredLogs(
      logs.filter((log) =>
        dayjs(log.timestamp).format("YYYY-MM-DD") === selected
      )
    );
  };

  const handleRetrainModel = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/reentrenar_modelo/", {}, { withCredentials: true });
      message.success("El modelo de IA se ha reentrenado.");
      fetchLogs();
      fetchNoReentrenados(); // <-- Actualiza el número después de reentrenar
    } catch (error) {
      message.error("Error al reentrenar el modelo.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          minWidth: 0,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: 10,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Historial de Reentrenamientos del Modelo</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
          
         
          <Space>
            <DatePicker
              allowClear
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Buscar por fecha"
              format="YYYY-MM-DD"
              style={{ minWidth: 140 }}
            />
            {selectedDate && (
              <Button onClick={() => handleDateChange(null)} size="small">
                Limpiar
              </Button>
            )}
          </Space>
           <Button
            onClick={fetchLogs}
            loading={loading}
            icon={<ReloadOutlined spin={loading} />}
          >
            Recargar historial
          </Button>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Popconfirm
            title={
              noReentrenados > 0
                ? `¿Estás seguro de que deseas reentrenar el modelo de IA con ${noReentrenados} paciente${noReentrenados === 1 ? "" : "s"} nuevos?`
                : "¿Estás seguro de que deseas reentrenar el modelo de IA?"
            }
              description="Esta acción puede tardar varios minutos y reemplazará el modelo actual."
              onConfirm={() => { handleRetrainModel(); }}
              okText="Sí, reentrenar"
              cancelText="Cancelar"
            >
              <Button
                type="primary"
                loading={loading}
                style={{ position: "relative" }}
              >
                Reentrenar modelo de IA
              </Button>
            </Popconfirm>
            {noReentrenados > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#ff4d4f",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 7px",
                  fontSize: 12,
                  fontWeight: "bold",
                  minWidth: 22,
                  textAlign: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
                }}
              >
                {noReentrenados}
              </span>
            )}
          </div>
        </div>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Tabla
            columns={columns}
            dataSource={filteredLogs}
            loading={loading}
            rowKey="id"
            locale={{ emptyText: "No hay reentrenamientos registrados" }}
            style={{ minWidth: 600 }}
            footer={() => `Total de reentrenamientos: ${filteredLogs.length}`}
          />
        </div>
        <Modal
          title={
            modalType === "reporte"
              ? "Reporte de Clasificación"
              : modalType === "matriz"
              ? "Matriz de Confusión"
              : modalType === "importancia"
              ? "Top 5 características"
              : ""
          }
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={modalType === "importancia" ? 800 : 600}
        >
          <DetalleModal modalType={modalType} modalData={modalData} />
        </Modal>
      </div>
    </div>
  );
}