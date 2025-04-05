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

  const factores = { ...stats };
  delete factores.resultado;
  const labels = Object.keys(factores);
  const siData = labels.map((col) => factores[col]?.si || 0);
  const noData = labels.map((col) => factores[col]?.no || 0);

  const barData = {
    labels,
    datasets: [
      {
        label: "Sí",
        data: siData,
        backgroundColor: "rgb(255, 4, 4)",
        borderColor: "rgb(116, 3, 3)",
        borderWidth: 1,
      },
      {
        label: "No",
        data: noData,
        backgroundColor: "rgba(65, 255, 7, 0.6)",
        borderColor: "rgb(0, 102, 26)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permitimos ajustar la altura al contenedor
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Distribución de Factores" },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          autoSkip: true, // Omite etiquetas si hay demasiadas
          maxTicksLimit: 10, // Limita el número de etiquetas visibles
        },
      },
      y: { 
        beginAtZero: true,
        suggestedMax: Math.max(...siData, ...noData) * 1.2, // Limita el eje Y dinámicamente
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
