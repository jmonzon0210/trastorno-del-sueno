import React from "react";
import { Formik, Form } from "formik";
import NumberInput from "../NumberInput";
import SelectField from "../SelectField";
import PredictionModal from "../PredictionModal";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import formSchema from "../../schemas/formSchema";

 const handlePredictionResult = (result) => {
   if (result.length === 2) {
     const class1Probability = result[1] * 100; // Convertir a porcentaje
     const roundedClass1Probability = Math.round(class1Probability * 100) / 100;

     console.log(`Resultado de la evaluacion : ${roundedClass1Probability}%`);

     return `${roundedClass1Probability}%`;
   }
   return "Predicción no válida";
 };

// Medias y desviaciones estándar extraídas de Python
 const means = [
   0.648936, 4.382979, 0.234043, 0.138298, 0.053191, 0.106383,
   0.106383, 0.297872, 0.170213, 0.159574, 0.074468, 0.170213, 0.297872,
    0.138298, 0.106383, 0.053191, 0.617021, 0.202128, 0.170213,
 ];

 const stdDevs = [
  0.479862, 0.843780, 0.425669, 0.347063, 0.225618, 0.309980,
  0.309980, 0.459775, 0.377835, 0.368175, 0.263939, 0.377835, 0.459775,
  0.347063, 0.309980, 0.225618, 0.488720, 0.403740, 0.377835
 ];

// Función para estandarizar los valores de entrada
 const standardize = (inputData) => {
   return inputData.map(
     (value, index) => (value - means[index]) / stdDevs[index]
   );
 };

const EvalForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [model, setModel] = useState(null);
   const [prediction, setPrediction] = useState(null);

   const predict = async (inputData) => {
     if (model) {
       const inputTensor = tf.tensor2d([inputData]);
       const prediction = model.predict(inputTensor);
       return prediction.dataSync();
     }
     return null;
   };

   const predictSubmit = async (event) => {
     event.preventDefault();
     const result = await predict(inputData);
     setPrediction(result[0]);
 };

   useEffect(() => {
     const loadModel = async () => {
      const loadedModel = await tf.loadLayersModel("model/model.json");
       setModel(loadedModel);
       loadedModel.summary();
       console.log("modelo cargado");
     };

     loadModel();
   }, []);

   const handleSubmit = async (values, { resetForm }) => {
     const fieldOrder = [
        "edad",
         "sexo",
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
          "medicamentoso",
          "cognitivo_conductual",
          "higienico_dietetico",
     ];

  //   // Obtener y ordenar los valores del formulario
     const orderedValues = fieldOrder.map((field) => {
       const value = values[field];
       return typeof value === "string" ? Number(value) : value;
     });

  //   // Estandarizar los valores
     const standardizedValues = standardize(orderedValues);

     console.log(standardizedValues);

  //   // Llamar a la función de predicción con los valores estandarizados
     const result = await predict(standardizedValues);

  //   // Procesar el resultado de la predicción
     const mortalityRate = handlePredictionResult(result);

  //   // Mostrar el resultado de la predicción
     setPrediction(mortalityRate);

     setIsModalOpen(true);

  //   // Reiniciar el formulario
      resetForm();
   };

  const handleSubmit = () => {
    setIsModalOpen(true);

    // Reiniciar el formulario
     resetForm();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Formik
        initialValues={{
          edad: 0,
          sexo: "",
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
          medicamentoso :0,
          cognitivo_conductual :0,
          higienico_dietetico :0,
          
        }}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, values, errors, touched }) => (
          <Form>
            <div className="relative border-4 border-blue-500 rounded-lg shadow-md text-center bg-gray-100 p-6">
              <div className="absolute inset-0 bg-gray-100 rounded-lg"></div>
              <div className="relative z-10 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
                Evaluar Paciente
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <SelectField
                name="ant_patologicos_fam"
                label="Antecedentes patológicos familiares"
                value={values.ant_patologicos_fam}
                handleChange={handleChange}
                error={errors.ant_patologicos_fam}
                touched={touched.ant_patologicos_fam}
              />
              <SelectField
                name="ant_pre_peri_postnatales_positivos"
                label="Antecedentes pre, peri o postnatales positivos"
                value={values.ant_pre_peri_postnatales_positivos}
                handleChange={handleChange}
                error={errors.ant_pre_peri_postnatales_positivos}
                touched={touched.ant_pre_peri_postnatales_positivos}
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
                label="Consumo de tóxicos"
                value={values.consumo_toxicos}
                handleChange={handleChange}
                error={errors.consumo_toxicos}
                touched={touched.consumo_toxicos}
              />
              <SelectField
                name="exp_medios_pantallas"
                label="Exposición a medios y pantallas"
                value={values.exp_medios_pantallas}
                handleChange={handleChange}
                error={errors.exp_medios_pantallas}
                touched={touched.exp_medios_pantallas}
              />
              <SelectField
                name="trastorno_neurodesarrollo"
                label="Trastorno del neurodesarrollo"
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
                label="Trastornos del aprendizaje"
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
                name="cefalea"
                label="Cefalea"
                value={values.cefalea}
                handleChange={handleChange}
                error={errors.cefalea}
                touched={touched.cefalea}
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
                name="depresion"
                label="Depresión"
                value={values.depresion}
                handleChange={handleChange}
                error={errors.depresion}
                touched={touched.depresion}
              />
              <SelectField
                name="medicamentoso"
                label="Medicamentoso"
                value={values.medicamentoso}
                handleChange={handleChange}
                error={errors.medicamentoso}
                touched={touched.medicamentoso}
              />
               <SelectField
                name="cognitivo_conductual"
                label="Cognitivo-conductual"
                value={values.cognititivo_conductual}
                handleChange={handleChange}
                error={errors.cognitivo_conductual}
                touched={touched.cognitivo_conductual}
              />
               <SelectField
                name="higienico_dietetico"
                label="Higiénico-Dietético"
                value={values.higienico_dietetico}
                handleChange={handleChange}
                error={errors.higienico_dietetico}
                touched={touched.higienico_dietetico}
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Evaluar
            </button>
          </Form>
        )}
      </Formik>
      <PredictionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        prediction={84.68}
      />
    </div>
  );
};

export default EvalForm;
