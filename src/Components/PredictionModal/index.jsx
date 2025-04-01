import React from "react";

const PredictionModal = ({ isOpen, onClose, prediction, probabilidad_1, probabilidad_0 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-md transform transition-transform duration-300 scale-100 hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Resultado de la Predicción
        </h2>
        <p className="text-lg mb-6 text-gray-800">
          Diagnóstico: <span className="font-bold">{prediction}</span>
          <br/>
          Probabilidad de Positivo: {(probabilidad_1 *100)}%
          <br/>
          Probabilidad de Negativo: {(probabilidad_0 *100)}%
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;
