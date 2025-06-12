import React, { useState, useEffect } from "react";
import { Form, message, Menu } from "antd";
import axios from "axios";
import PredictionModal from "../PredictionModal";
import PacienteForm from "../Gestion de Pacientes/FormularioPacientes";

const EvalForm = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [prob, setProb] = useState(null);
  const [lastValues, setLastValues] = useState(null);
  const [loading, setLoading] = useState(false); // Nuevo estado
  const [current, setCurrent] = useState(0);
  const [savedPatientId, setSavedPatientId] = useState(null);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    const fieldOrder = [
      "sexo",
      "edad",
      "ant_patologicos_fam",
      "ant_pre_peri_postnatales_positivos",
      "alteraciones_anatomicas",
      "consumo_medicamentos",
      "consumo_toxicos",
      "exp_medios_pantallas",
      "trastorno_neurodesarrollo",
      "obesidad",
      "hipertension_arterial",
      "trastornos_aprendizaje",
      "trastornos_comportamiento",
      "cefalea",
      "res_insulina",
      "depresion",
      "higienico_dietetico",
      "cognitivo_conductual",
      "medicamentoso",
    ];

    const orderedValues = fieldOrder.map((f) => Number(values[f]));
    try {
      const resp = await axios.post(
        "http://localhost:8000/api/predecir/",
        { variables: orderedValues },
        { withCredentials: true }
      );
      setPrediction(resp.data.prediccion);
      setProb(resp.data.probabilidad); // Solo la máxima
      setLoading(false);
      setIsModalOpen(true);
      setLastValues(values);
    } catch {
      message.error("Error al realizar la predicción");
      setLoading(false);
    }
  };

  const handleSavePatient = async () => {
    if (!lastValues || prediction === null) return;
    setLoading(true);
    const dataToSend = {
      ...lastValues,
      resultado: prediction,
      confianza_prediccion: prob,
    };
    try {
      const resp = await axios.post(
        "http://localhost:8000/api/save_patient/",
        dataToSend,
        { withCredentials: true }
      );
      setSavedPatientId(resp.data.id); // Guarda el ID
      message.success(`Paciente guardado con ID ${resp.data.id}`);
      form.resetFields(); // Resetea el formulario
      setCurrent(0); // Vuelve al primer paso
    } catch (error) {
      setSavedPatientId(null);
      message.error("Error al guardar el paciente");
      console.error("Error al guardar el paciente:", error);
    }
    setLoading(false);
  };

  const initialValues = {
    sexo: 0,
    edad: 0,
    ant_patologicos_fam: 0,
    ant_pre_peri_postnatales_positivos: 0,
    alteraciones_anatomicas: 0,
    consumo_medicamentos: 0,
    consumo_toxicos: 0,
    exp_medios_pantallas: 0,
    trastorno_neurodesarrollo: 0,
    obesidad: 0,
    hipertension_arterial: 0,
    trastornos_aprendizaje: 0,
    trastornos_comportamiento: 0,
    cefalea: 0,
    res_insulina: 0,
    depresion: 0,
    higienico_dietetico: 0,
    cognitivo_conductual: 0,
    medicamentoso: 0,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSavedPatientId(null);
    form.resetFields(); // <-- Resetea el formulario
    setCurrent(0); // <-- Vuelve al primer paso
  };

  const handleShowMetrics = async (metricType) => {
    setLoadingMetrics(true);
    setSelectedMetric(metricType);
    try {
      const resp = await fetch(
        "http://localhost:8000/api/metricas_modelo_actual/",
        { credentials: "include" }
      );
      const data = await resp.json();
      setMetrics(data);
      setMetricsVisible(true);
    } catch {
      setMetrics({ error: "No se pudieron obtener las métricas." });
      setMetricsVisible(true);
    }
    setLoadingMetrics(false);
  };

  const metricsMenu = (
    <Menu
      onClick={({ key }) => handleShowMetrics(key)}
      items={[
        { key: "reporte", label: "Reporte de Clasificación" },
        { key: "matriz", label: "Matriz de Confusión" },
        { key: "importancia", label: "Top 5 características" },
      ]}
    />
  );

  // Cargar métricas automáticamente al abrir el modal de predicción
  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        setLoadingMetrics(true);
        try {
          const resp = await fetch(
            "http://localhost:8000/api/metricas_modelo_actual/",
            { credentials: "include" }
          );
          const data = await resp.json();
          setMetrics(data);
        } catch {
          setMetrics({ error: "No se pudieron obtener las métricas." });
        }
        setLoadingMetrics(false);
      })();
    }
  }, [isModalOpen]);

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4 py-12 h-full">
      <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <PacienteForm
          form={form}
          onFinish={onFinish}
          initialValues={initialValues}
          loading={loading}
          current={current}
          setCurrent={setCurrent}
        />
        <PredictionModal
          visible={isModalOpen}
          onOk={savedPatientId ? handleCloseModal : handleSavePatient}
          onCancel={handleCloseModal} // <-- Siempre usa handleCloseModal
          predictionResult={prediction}
          predictionProb={prob}
          savedPatientId={savedPatientId}
          okText={savedPatientId ? "Cerrar" : "Guardar"}
          cancelText={savedPatientId ? null : "Cancelar"}
          confirmLoading={loading}
          metrics={metrics}
          metricsVisible={metricsVisible}
          setMetricsVisible={setMetricsVisible}
          loadingMetrics={loadingMetrics}
          metricsMenu={metricsMenu}
          selectedMetric={selectedMetric}
        />
      </div>
    </div>
  );
};

export default EvalForm;
