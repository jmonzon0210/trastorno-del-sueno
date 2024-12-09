import React from "react";

const PredictionModal = ({ isOpen, onClose, prediction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Resultado de la Predicción
        </h2>
        <p className="text-lg mb-4 text-center">
          Diagnóstico {prediction}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;
