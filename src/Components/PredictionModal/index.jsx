import { Modal, Tag } from "antd";

export default function PredictionModal({
  visible,
  onOk,
  onCancel,
  predictionResult,
  predictionProb1,
  predictionProb0,
  okText,
  cancelText,
  confirmLoading, // <-- Nuevo prop
}) {
  return (
    <Modal
      title="Predicción del modelo"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading} // <-- Spinner en botón OK
    >
      <p>
        Diagnóstico:  {""}
        <Tag 
          color={predictionResult === 1 ? "red" : "green"}
          style={{ fontSize: "0.9rem", left: "0.5em" }}
        >
          {predictionResult === 1 ? "Positivo" : "Negativo"}
        </Tag>
        <br />
        Probabilidad Positivo: {predictionProb1 ? (predictionProb1 * 100).toFixed(2) : 0}%<br />
        Probabilidad Negativo: {predictionProb0 ? (predictionProb0 * 100).toFixed(2) : 0}%
      </p>
    </Modal>
  );
}
