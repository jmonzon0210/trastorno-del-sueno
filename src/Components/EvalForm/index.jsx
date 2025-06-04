import React, { useState } from "react";
import { Form, message } from "antd";
import axios from "axios";
import PredictionModal from "../PredictionModal";
import PacienteForm from "../PacienteForm";

const EvalForm = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [prob0, setProb0] = useState(null);
  const [prob1, setProb1] = useState(null);
  const [lastValues, setLastValues] = useState(null);
  const [loading, setLoading] = useState(false); // Nuevo estado
  const [current, setCurrent] = useState(0);
  const [savedPatientId, setSavedPatientId] = useState(null);


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
        "https://sleepdisorder-detector.duckdns.org/api/predecir/",
        { variables: orderedValues },
        { withCredentials: true }
      );
      setPrediction(resp.data.prediccion);
      console.log(orderedValues)
      console.log(resp.data.prediccion)
      setProb0(resp.data.probabilidad_0);
      setProb1(resp.data.probabilidad_1);
      setLoading(false);
      setIsModalOpen(true);
      setLastValues(values); // Guardar los valores para usarlos luego

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
  };
  try {
    const resp = await axios.post(
      "https://sleepdisorder-detector.duckdns.org/api/save_patient/",
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
  form.resetFields();      // <-- Resetea el formulario
  setCurrent(0);           // <-- Vuelve al primer paso
};

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4 py-12 h-full">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <PacienteForm form={form} onFinish={onFinish} initialValues={initialValues} loading={loading} current={current} setCurrent={setCurrent}/>
        <PredictionModal
        visible={isModalOpen}
        onOk={savedPatientId ? handleCloseModal : handleSavePatient}
        onCancel={savedPatientId ? undefined : handleCloseModal}
        predictionResult={prediction}
        predictionProb1={prob1}
        predictionProb0={prob0}
        savedPatientId={savedPatientId}
        okText={savedPatientId ? "Cerrar" : "Guardar"}
        cancelText={savedPatientId ? null : "Cancelar"}
        confirmLoading={loading}
      />
      </div>
    </div>
  );
};

export default EvalForm;
