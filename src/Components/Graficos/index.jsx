import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./../Loading";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://sleepdisorder-detector.duckdns.org/api/estadisticas/", { withCredentials: true })
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar estadísticas:", error);
        setLoading(false);
      });
  }, []);

  // Mapeo de nombres completos
  const labelMap = {
    ant_patologicos_fam: "Antecedentes Patológicos Familiares",
    ant_pre_peri_postnatales_positivos: "Antecedentes Pre/Peri/Postnatales Positivos",
    alteraciones_anatomicas: "Alteraciones Anatómicas",
    consumo_medicamentos: "Consumo de Medicamentos",
    consumo_toxicos: "Consumo de Tóxicos",
    exp_medios_pantallas: "Exposición a Medios y Pantallas",
    trastorno_neurodesarrollo: "Trastorno del Neurodesarrollo",
    obesidad: "Obesidad",
    hipertension_arterial: "Hipertensión Arterial",
    trastornos_aprendizaje: "Trastornos de Aprendizaje",
    trastornos_comportamiento: "Trastornos de Comportamiento",
    cefalea: "Cefalea",
    res_insulina: "Resistencia a la Insulina",
    depresion: "Depresión",
    higienico_dietetico: "Higiene Dietética",
    cognitivo_conductual: "Cognitivo Conductual",
    medicamentoso: "Medicamentoso",
    sexo: "Sexo (Masculino/Femenino)",
  };

  // Datos para el gráfico de pastel (sin cambios)
  const pieData = {
    labels: ["Positivo", "Negativo"],
    datasets: [
      {
        label: "Resultados",
        data: [stats.resultado?.si || 0, stats.resultado?.no || 0],
        backgroundColor: ["rgb(255, 0, 0)", "rgba(21, 255, 0, 0.54)"],
        borderColor: ["rgb(128, 4, 4)", "rgb(2, 75, 5)"],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de barras
  const factores = { ...stats };
  delete factores.resultado;
  const labels = Object.keys(factores).map((key) => labelMap[key] || key);
  const siData = labels.map((label, index) => factores[Object.keys(factores)[index]]?.si || 0);
  const noData = labels.map((label, index) => factores[Object.keys(factores)[index]]?.no || 0);

  // Índice de "Sexo (Masculino/Femenino)"
  const sexoIndex = labels.indexOf("Sexo (Masculino/Femenino)");

  const barData = {
    labels,
    datasets: [
      {
        label: "Sí",
        data: siData.map((value, index) => (index === sexoIndex ? 0 : value)), // Ocultar "Sí" para sexo
        backgroundColor: "rgb(255, 4, 4)",
        borderColor: "rgb(116, 3, 3)",
        borderWidth: 1,
      },
      {
        label: "No",
        data: noData.map((value, index) => (index === sexoIndex ? 0 : value)), // Ocultar "No" para sexo
        backgroundColor: "rgba(65, 255, 7, 0.6)",
        borderColor: "rgb(0, 102, 26)",
        borderWidth: 1,
      },
      {
        label: "Masculino",
        data: labels.map((label, index) =>
          index === sexoIndex ? stats.sexo?.masculino || 0 : 0
        ),
        backgroundColor: "rgba(173, 216, 230, 0.6)", // Azul claro
        borderColor: "rgba(173, 216, 230, 1)",
        borderWidth: 1,
      },
      {
        label: "Femenino",
        data: labels.map((label, index) =>
          index === sexoIndex ? stats.sexo?.femenino || 0 : 0
        ),
        backgroundColor: "rgba(255, 182, 193, 0.6)", // Rosa claro
        borderColor: "rgba(255, 182, 193, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Distribución de Factores" },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(
          ...siData,
          ...noData,
          stats.sexo?.masculino || 0,
          stats.sexo?.femenino || 0
        ) * 1.2,
      },
    },
  };

  return (
    <div className="stats-dashboard">
      {loading ? (
        <div className="loading-container">
          <Loading />
        </div>
      ) : (
        <div className="charts-container">
          <div className="pie-chart">
            <h3>Resultados</h3>
            <Pie data={pieData} />
          </div>
          <div className="bar-chart">
            <h3>Factores de Pacientes</h3>
            <div className="bar-chart-wrapper">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;
