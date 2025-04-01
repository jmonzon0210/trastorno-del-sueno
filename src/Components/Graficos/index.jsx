import React, { useEffect, useState } from "react";
import axios from "axios";
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

// Registrar elementos necesarios de Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/estadisticas/", { withCredentials: true })
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar estadísticas:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;

  // 🟡 Preparar datos para el gráfico de pastel (resultado)
  const pieData = {
    labels: ["Positivo", "Negativo"],
    datasets: [
      {
        label: "Resultados",
        data: [stats.resultado.si, stats.resultado.no],
        backgroundColor: ["rgb(255, 0, 0)", "rgba(21, 255, 0, 0.54)"],
        borderColor: ["rgb(128, 4, 4)", "rgb(2, 75, 5)"],
        borderWidth: 1,
      },
    ],
  };

  // 🔵 Preparar datos para el gráfico de barras (factores)
  const factores = { ...stats };
  delete factores.resultado;  // Excluir la columna resultado del gráfico de barras

  const labels = Object.keys(factores);
  const siData = labels.map((col) => factores[col].si);
  const noData = labels.map((col) => factores[col].no);

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
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribución de Factores",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", gap: "20px" }}>
      {/* Gráfico de pastel a la izquierda */}
      <div style={{ width: "30%", maxWidth: "400px" }}>
        <h3 style={{ textAlign: "center" }}>Resultados</h3>
        <Pie data={pieData} />
      </div>

      {/* Gráfico de barras a la derecha */}
      <div style={{ flex: 1 }}>
        <h3 style={{ textAlign: "center" }}>Factores de Pacientes</h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default StatsDashboard;
