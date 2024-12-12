import React, { useEffect, useRef } from "react";

const NumberInput = ({ name, label, value, handleChange, error, touched }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      inputElement.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={`Insertar ${label}`}
        className={`number-input w-full p-2 border ${
          error && touched ? "border-red-500" : "border-gray-300"
        } rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        ref={inputRef}
      />
      {error && touched && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default NumberInput;
