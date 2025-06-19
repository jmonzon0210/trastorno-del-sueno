// Loading.js
import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <span className="loading-text">Cargando...</span>
    </div>
  );
};

export default Loading;
