import { Modal, Tag, Button, Dropdown } from "antd";
import DetalleModal from "./ReentrenarModelo/DetalleModal";

export default function PredictionModal({
  visible,
  onOk,
  onCancel,
  predictionResult,
  predictionProb,
  savedPatientId,
  okText,
  cancelText,
  confirmLoading,
  // Props de métricas
  metrics,
  metricsVisible,
  setMetricsVisible,
  loadingMetrics,
  metricsMenu,
  selectedMetric,
}) {
  return (
    <>
      <Modal
        title="Predicción del modelo"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText={okText}
        cancelText={cancelText}
        confirmLoading={confirmLoading}
        footer={(_, { OkBtn, CancelBtn }) => (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Dropdown overlay={metricsMenu} trigger={["click"]}>
                <Button loading={loadingMetrics} style={{ marginRight: 4 }}>
                  Ver más métricas del modelo
                </Button>
              </Dropdown>
            </div>
            <div>
              {!savedPatientId && <CancelBtn />}
              <span style={{ marginLeft: 3 }}>
                <OkBtn />
              </span>
            </div>
          </div>
        )}
      >
        <p>
          Diagnóstico:{" "}
          <Tag
            color={predictionResult === 1 ? "red" : "green"}
            style={{ fontSize: "0.9rem", left: "0.5em" }}
          >
            {predictionResult === 1 ? "Positivo" : "Negativo"}
          </Tag>
          <br />
          Nivel de confianza:{" "}
          <span style={{ fontWeight: "bold" }}>
            {predictionProb !== null && predictionProb !== undefined
              ? (predictionProb * 100).toFixed(2)
              : 0}  %
          </span>
          <br />
          <span>
            Precisión del modelo:{" "}
            <span style={{ fontWeight: "bold" }}>
              {metrics && metrics.accuracy !== undefined && metrics.accuracy !== null
                ? (Number(metrics.accuracy) * 100).toFixed(2) + " %"
                : "Cargando..."}
            </span>
          </span>
          <br />
          {savedPatientId && (
            <div>
              Paciente guardado con ID:{" "}
              <span style={{ fontWeight: "bold" }}>{savedPatientId}</span>
            </div>
          )}
        </p>
      </Modal>
      <Modal
        title={
          selectedMetric === "reporte"
            ? "Reporte de Clasificación"
            : selectedMetric === "matriz"
            ? "Matriz de Confusión"
            : selectedMetric === "importancia"
            ? "Top 5 características"
            : "Métricas del modelo actual"
        }
        visible={metricsVisible}
        onCancel={() => setMetricsVisible(false)}
        footer={null}
        width={selectedMetric === "importancia" ? 800 : 600}
      >
        {metrics ? (
          metrics.error ? (
            <div style={{ color: "red" }}>{metrics.error}</div>
          ) : (
            <DetalleModal modalType={selectedMetric} modalData={metrics} />
          )
        ) : (
          "Cargando..."
        )}
      </Modal>
    </>
  );
}
