import React, { useState } from "react";
import { Formik, Form } from "formik";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NumberInput from "../NumberInput";
import SelectField from "../SelectField";
import PredictionModal from "../PredictionModal";
import formSchema from "../../schemas/formSchema";
import { showToast } from "../ToastNotification";
import axios from "axios";

const EvalForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [probabilidad_0, setProbabilidad_0] = useState(null);
  const [probabilidad_1, setProbabilidad_1] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  const handleNextStep = () => {
    if (currentPage < 4) setCurrentPage(currentPage + 1);
  };

  const handlePrevStep = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSubmit = async (values, { resetForm }) => {
    // Mapear los valores del formulario en el orden correcto para el backend
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

    // Convertir los valores a un array ordenado
    const orderedValues = fieldOrder.map((field) =>
      typeof values[field] === "string" ? Number(values[field]) : values[field]
    );
    console.log(orderedValues);

    let resultado;

    try {
      // Enviar los datos al backend para la predicción
      const response = await axios.post(
        "https://sleepdisorder-detector.duckdns.org/api/predecir/",
        { variables: orderedValues }, // Formato esperado por el backend
        { withCredentials: true }  
      );

      // Mostrar la predicción
      resultado = response.data.prediccion === 1 ? "Positivo" : "Negativo";
      const probabilidad_0 = response.data.probabilidad_0;
      const probabilidad_1 = response.data.probabilidad_1;
      setPrediction(resultado);
      setProbabilidad_0(probabilidad_0);
      setProbabilidad_1(probabilidad_1);
      setIsModalOpen(true);
      showToast("Predicción realizada con éxito", "success");
    } catch (error) {
      console.error("Error al predecir:", error);
      showToast("Error al realizar la predicción", "error");
    }
    
    const dataToSend = {
      sexo: values.sexo,  
      edad: values.edad,
      ant_patologicos_fam: values.ant_patologicos_fam,
      ant_pre_peri_postnatales_positivos: values.ant_pre_peri_postnatales_positivos,
      alteraciones_anatomicas: values.alteraciones_anatomicas,
      consumo_medicamentos: values.consumo_medicamentos,
      consumo_toxicos: values.consumo_toxicos,
      exp_medios_pantallas: values.exp_medios_pantallas,
      trastorno_neurodesarrollo: values.trastorno_neurodesarrollo,
      obesidad: values.obesidad,
      hipertension_arterial: values.hipertension_arterial,
      trastornos_aprendizaje: values.trastornos_aprendizaje,
      trastornos_comportamiento: values.trastornos_comportamiento,
      cefalea: values.cefalea,
      res_insulina: values.res_insulina,
      depresion: values.depresion,
      higienico_dietetico: values.higienico_dietetico,
      cognitivo_conductual: values.cognitivo_conductual,
      medicamentoso: values.medicamentoso,
      resultado: resultado === "Positivo" ? 1 : 0,
    };


    try {
      const response = await axios.post('https://sleepdisorder-detector.duckdns.org/api/save_patient/', dataToSend,
    {withCredentials: true}
  );
    
      console.log(response.data);
      showToast("Paciente guardado", "info");

    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      showToast("Error al guardar el paciente", "error");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Formik
        initialValues={{
          edad: 0,
          sexo: 0,
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
        }}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, values, errors, touched }) => (
          <Form>
            <div className="relative border-2 border-blue-300 rounded-lg shadow-lg text-center bg-white p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg opacity-50"></div>
              <div className="relative z-5 text-4xl font-bold text-gray-800">
                Formulario de Evaluación
              </div>
            </div>

            <div className="mt-10">
              {currentPage === 1 && (
                <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Antecedentes Médicos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    name="sexo"
                    label="Sexo"
                    value={values.sexo}
                    handleChange={handleChange}
                    error={errors.sexo}
                    touched={touched.sexo}
                  />
                  <NumberInput
                    name="edad"
                    label="Edad"
                    value={values.edad}
                    handleChange={handleChange}
                    error={errors.edad}
                    touched={touched.edad}
                  />
                </div>
                </div>
              )}
              {currentPage === 2 && (
                  <div className="mt-10">
                  <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Factores de riesgo asociados</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <SelectField
                    name="ant_pre_peri_postnatales_positivos"
                    label="Antecedentes pre, peri o postnatales positivos"
                    value={values.ant_pre_peri_postnatales_positivos}
                    handleChange={handleChange}
                    error={errors.ant_pre_peri_postnatales_positivos}
                    touched={touched.ant_pre_peri_postnatales_positivos}
                  />
                  <SelectField
                    name="ant_patologicos_fam"
                    label="Antecedentes patológicos familiares"
                    value={values.ant_patologicos_fam}
                    handleChange={handleChange}
                    error={errors.ant_patologicos_fam}
                    touched={touched.ant_patologicos_fam}
                  />
                  <SelectField
                    name="alteraciones_anatomicas"
                    label="Alteraciones anatómicas"
                    value={values.alteraciones_anatomicas}
                    handleChange={handleChange}
                    error={errors.alteraciones_anatomicas}
                    touched={touched.alteraciones_anatomicas}
                  />
                  <SelectField
                    name="consumo_medicamentos"
                    label="Consumo de medicamentos"
                    value={values.consumo_medicamentos}
                    handleChange={handleChange}
                    error={errors.consumo_medicamentos}
                    touched={touched.consumo_medicamentos}
                  />
                  <SelectField
                    name="consumo_toxicos"
                    label="Consumo de Tóxicos"
                    value={values.consumo_toxicos}
                    handleChange={handleChange}
                    error={errors.consumo_toxicos}
                    touched={touched.consumo_toxicos}
                  />
                  <SelectField
                    name="exp_medios_pantallas"
                    label="Exposición a medios de pantalla"
                    value={values.exp_medios_pantallas}
                    handleChange={handleChange}
                    error={errors.exp_medios_pantallas}
                    touched={touched.exp_medios_pantallas}
                  />
                  
                </div>
                </div>
              )}
              {currentPage === 3 && (
                  <div className="mt-10">
                  <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Consecuencias asociadas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    name="trastorno_neurodesarrollo"
                    label="Trastornos del neurodesarrollo"
                    value={values.trastorno_neurodesarrollo}
                    handleChange={handleChange}
                    error={errors.trastorno_neurodesarrollo}
                    touched={touched.trastorno_neurodesarrollo}
                  />
                  <SelectField
                    name="obesidad"
                    label="Obesidad"
                    value={values.obesidad}
                    handleChange={handleChange}
                    error={errors.obesidad}
                    touched={touched.obesidad}
                  />
                  <SelectField
                    name="hipertension_arterial"
                    label="Hipertensión arterial"
                    value={values.hipertension_arterial}
                    handleChange={handleChange}
                    error={errors.hipertension_arterial}
                    touched={touched.hipertension_arterial}
                  />
                  <SelectField
                    name="trastornos_aprendizaje"
                    label="Trastornos del Aprendizaje"
                    value={values.trastornos_aprendizaje}
                    handleChange={handleChange}
                    error={errors.trastornos_aprendizaje}
                    touched={touched.trastornos_aprendizaje}
                  />
                  <SelectField
                    name="trastornos_comportamiento"
                    label="Trastornos del comportamiento"
                    value={values.trastornos_comportamiento}
                    handleChange={handleChange}
                    error={errors.trastornos_comportamiento}
                    touched={touched.trastornos_comportamiento}
                  />
                  <SelectField
                    name="res_insulina"
                    label="Resistencia a la insulina"
                    value={values.res_insulina}
                    handleChange={handleChange}
                    error={errors.res_insulina}
                    touched={touched.res_insulina}
                  />
                  <SelectField
                    name="cefalea"
                    label="Cefalea"
                    value={values.cefalea}
                    handleChange={handleChange}
                    error={errors.cefalea}
                    touched={touched.cefalea}
                  />
                  <SelectField
                    name="depresion"
                    label="Depresión"
                    value={values.depresion}
                    handleChange={handleChange}
                    error={errors.depresion}
                    touched={touched.depresion}
                  />
                  
                </div>
                </div>
              )}
              {currentPage === 4 && (
                <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Tratamientos asociados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    name="higienico_dietetico"
                    label="Higiénico-Dietético"
                    value={values.higienico_dietetico}
                    handleChange={handleChange}
                    error={errors.higienico_dietetico}
                    touched={touched.higienico_dietetico}
                  />
                  <SelectField
                    name="cognitivo-conductual"
                    label="Cognitivo-Conductual"
                    value={values.cognitivo_conductual}
                    handleChange={handleChange}
                    error={errors.cognitivo_conductual}
                    touched={touched.cognitivo_conductual}
                  />
                  <SelectField
                    name="medicamentoso"
                    label="Medicamentoso"
                    value={values.medicamentoso}
                    handleChange={handleChange}
                    error={errors.medicamentoso}
                    touched={touched.medicamentoso}
                  />
                </div>
                </div>
              )}

              <div className="flex justify-between mt-4">
                {currentPage > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-2 px-4 bg-gray-500 text-white rounded-md"
                  >
                    <FaArrowLeft />
                  </button>
                )}
                {currentPage < 4 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    <FaArrowRight />
                  </button>
                )}
                {currentPage === 4 && (
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    Evaluar
                  </button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
        
      <PredictionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        prediction={prediction}
        probabilidad_1={probabilidad_1}
        probabilidad_0={probabilidad_0}
      />
    </div>
  );
};

export default EvalForm;
