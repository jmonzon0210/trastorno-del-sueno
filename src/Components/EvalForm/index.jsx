import React from "react";
import { Formik, Form } from "formik";
import NumberInput from "../NumberInput";
import SelectField from "../SelectField";
import PredictionModal from "../PredictionModal";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import formSchema from "../../schemas/formSchema";

// const handlePredictionResult = (result) => {
//   if (result.length === 2) {
//     const class1Probability = result[1] * 100; // Convertir a porcentaje
//     const roundedClass1Probability = Math.round(class1Probability * 100) / 100;

//     console.log(`Resultado de la evaluacion : ${roundedClass1Probability}%`);

//     return `${roundedClass1Probability}%`;
//   }
//   return "Predicción no válida";
// };

// Medias y desviaciones estándar extraídas de Python
// const means = [
//   0.61111111, 55.6666667, 0.216049383, 0.185185185, 0.0740740741, 0.037037037,
//   0.049382716, 0.104938272, 0.12345679, 0.203703704, 0.141975309, 0.0740740741,
//   0.290123457, 0.469135802, 0.0555555556, 125.123457, 76.7716049, 70.61728395,
//   10.9851852, 37.16666667, 15.7132716, 852.740741, 6.66666667, 328.564815,
//   4.67111111, 3.78919753, 33.4074074, 38.154321, 1.83641975, 4.73580247,
//   0.617283951, 0.135802469, 0.543209877,
// ];

// const stdDevs = [
//   0.48749802, 12.56243666, 0.41154835, 0.38844772, 0.2618914, 0.18885257,
//   0.21666579, 0.30647387, 0.3289608, 0.40275117, 0.34902481, 0.2618914,
//   0.45381917, 0.49904649, 0.22906142, 15.32518521, 14.43387421, 10.76524804,
//   2.10027106, 7.35875224, 2.49282175, 122.35409833, 1.77548463, 62.78950576,
//   1.35058789, 1.17610887, 9.72305111, 14.5502836, 0.3216002, 0.79618049,
//   0.48604987, 0.34257869, 0.49812941,
// ];

// Función para estandarizar los valores de entrada
// const standardize = (inputData) => {
//   return inputData.map(
//     (value, index) => (value - means[index]) / stdDevs[index]
//   );
// };

const EvalForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [model, setModel] = useState(null);
  // const [prediction, setPrediction] = useState(null);

  // const predict = async (inputData) => {
  //   if (model) {
  //     const inputTensor = tf.tensor2d([inputData]);
  //     const prediction = model.predict(inputTensor);
  //     return prediction.dataSync();
  //   }
  //   return null;
  // };

  // const predictSubmit = async (event) => {
  //   event.preventDefault();
  //   const result = await predict(inputData);
  //   setPrediction(result[0]);
  // };

  // useEffect(() => {
  //   const loadModel = async () => {
  //     const loadedModel = await tf.loadLayersModel("model/model.json");
  //     setModel(loadedModel);
  //     loadedModel.summary();
  //     console.log("modelo cargado");
  //   };

  //   loadModel();
  // }, []);

  // const handleSubmit = async (values, { resetForm }) => {
  //   const fieldOrder = [
  //     "sexo",
  //     "edad",
  //     "ecv",
  //     "tabaquismo",
  //     "epoc",
  //     "ecev",
  //     "cancer",
  //     "enf_art_perif",
  //     "obesidad",
  //     "desnutricion",
  //     "dislipidemia",
  //     "erpad",
  //     "dm",
  //     "hta",
  //     "glomerulopatia",
  //     "tas",
  //     "tad",
  //     "fc",
  //     "hb",
  //     "albumina",
  //     "urea",
  //     "creatinina",
  //     "fg",
  //     "acido_urico",
  //     "glucemia",
  //     "colesterol",
  //     "tgo",
  //     "tgp",
  //     "calcio",
  //     "potasio",
  //     "atencion_nefrologica",
  //     "inicio_tardio",
  //     "ccv",
  //   ];

  //   // Obtener y ordenar los valores del formulario
  //   const orderedValues = fieldOrder.map((field) => {
  //     const value = values[field];
  //     return typeof value === "string" ? Number(value) : value;
  //   });

  //   // Estandarizar los valores
  //   const standardizedValues = standardize(orderedValues);

  //   console.log(standardizedValues);

  //   // Llamar a la función de predicción con los valores estandarizados
  //   const result = await predict(standardizedValues);

  //   // Procesar el resultado de la predicción
  //   const mortalityRate = handlePredictionResult(result);

  //   // Mostrar el resultado de la predicción
  //   setPrediction(mortalityRate);

  //   setIsModalOpen(true);

  //   // Reiniciar el formulario
  //   // resetForm();
  // };

  const handleSubmit = () => {
    setIsModalOpen(true);

    // Reiniciar el formulario
    // resetForm();
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
          tratamiento: 0,
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
                name="tratamiento"
                label="Tratamiento"
                value={values.tratamiento}
                handleChange={handleChange}
                error={errors.tratamiento}
                touched={touched.tratamiento}
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
