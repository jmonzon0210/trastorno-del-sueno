import React, { useEffect, useState } from "react";
import { Button, message, Modal, Popconfirm } from "antd";
import axios from "axios";
import Tabla from "../Tabla";

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
];

export default function ReentrenarModelo() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metricsModalVisible, setMetricsModalVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    precision: null,
    confusion_matrix: [],
    classification_report: ""
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://sleepdisorder-detector.duckdns.org/api/retrain_logs/", { withCredentials: true });
      setLogs(response.data);
    } catch {
      message.error("No se pudieron cargar los logs de reentrenamiento.");
    }
    setLoading(false);
  };

  const handleRetrainModel = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://sleepdisorder-detector.duckdns.org/api/reentrenar_modelo/", {}, { withCredentials: true });
      message.success("El modelo de IA se ha reentrenado.");
      setMetrics({
        precision: response.data.precision,
        confusion_matrix: response.data.confusion_matrix,
        classification_report: response.data.classification_report
      });
      setMetricsModalVisible(true);
      fetchLogs(); // Recarga el historial tras reentrenar
    } catch (error) {
      message.error("Error al reentrenar el modelo.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: 20,
        }}
      >
         <h2 style={{ textAlign: "center" }}>Historial de Reentrenamientos del Modelo</h2>
         <div style={{ height: 16 }} /> {/* Espacio entre el título y los botones */}
         <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
           <Popconfirm
             title="¿Estás seguro de que deseas reentrenar el modelo de IA?"
             description="Esta acción puede tardar varios minutos y reemplazará el modelo actual."
             onConfirm={handleRetrainModel}
             okText="Sí, reentrenar"
             cancelText="Cancelar"
           >
             <Button
               type="primary"
               loading={loading}
               style={{ flex: 1 }}
             >
               Reentrenar modelo de IA
             </Button>
           </Popconfirm>
           <Button
             onClick={fetchLogs}
             style={{ flex: 1 }}
           >
             Recargar historial
           </Button>
         </div>
         <div style={{ overflowX: "auto" }}>
           <Tabla
             columns={columns}
             dataSource={logs}
             loading={loading}
             rowKey="id"
             locale={{ emptyText: "No hay reentrenamientos registrados" }}
             size="small"
           />
         </div>
         <Modal
           title="Métricas del Modelo"
           visible={metricsModalVisible}
           onCancel={() => setMetricsModalVisible(false)}
           footer={null}
         >
          <div>
            <b>Matriz de Confusión</b>
            <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
            
            <br /><br />
              <table style={{ margin: "10px 0", borderCollapse: "collapse", textAlign: "center" }}>
                <tbody>
                  <tr>
                    <td style={{
                      border: "1px solid #ccc",
                      padding: 0,
                      background: "#d9f7be",
                      fontWeight: "bold",
                      width: 60,
                      height: 60,
                      verticalAlign: "middle"
                    }}>
                      TN<br /><span style={{ fontSize: 18 }}>{metrics.confusion_matrix[0]?.[0]}</span>
                    </td>
                    <td style={{
                      border: "1px solid #ccc",
                      padding: 0,
                      background: "#fffbe6",
                      fontWeight: "bold",
                      width: 60,
                      height: 60,
                      verticalAlign: "middle"
                    }}>
                      FP<br /><span style={{ fontSize: 18 }}>{metrics.confusion_matrix[0]?.[1]}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      border: "1px solid #ccc",
                      padding: 0,
                      background: "#fffbe6",
                      fontWeight: "bold",
                      width: 60,
                      height: 60,
                      verticalAlign: "middle"
                    }}>
                      FN<br /><span style={{ fontSize: 18 }}>{metrics.confusion_matrix[1]?.[0]}</span>
                    </td>
                    <td style={{
                      border: "1px solid #ccc",
                      padding: 0,
                      background: "#d9f7be",
                      fontWeight: "bold",
                      width: 60,
                      height: 60,
                      verticalAlign: "middle"
                    }}>
                      TP<br /><span style={{ fontSize: 18 }}>{metrics.confusion_matrix[1]?.[1]}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <b>Reporte de Clasificación</b>
            <pre style={{ background: "#f7f7f7", padding: 8, borderRadius: 4, fontSize: 13 }}>
              {metrics.classification_report}
            </pre>
          </div>
        </Modal>
      </div>
    </div>
  );
}
