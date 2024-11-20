import React from "react";

const SelectField = ({ name, label, value, handleChange, error, touched }) => {
  // Define las opciones dinámicamente
  const options =
    name === "sexo"
      ? [
          { value: 0, label: "Masculino" },
          { value: 1, label: "Femenino" },
        ]
        : name === "tratamiento"
        ? [
            { value: 0, label: "Higiénico-Dietético" },
            { value: 1, label: "Cognitivo-Conductual" },
            { value: 3, label: "Medicamentoso" },
          ]
      : [
          { value: 0, label: "No" },
          { value: 1, label: "Sí" },
        ];
      

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full p-2 border ${
          error && touched ? "border-red-500" : "border-gray-300"
        } rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && touched && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default SelectField;
