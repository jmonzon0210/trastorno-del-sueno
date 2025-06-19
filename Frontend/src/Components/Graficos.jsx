import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import { Card, Row, Col, Typography } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const { Title: AntTitle } = Typography;

const rojo = "#c81d11";
const verde = "#52c41a";

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
  higienico_dietetico: "Tratamiento Higienico-Dietético",
  cognitivo_conductual: "tratamiento Cognitivo-Conductual",
  medicamentoso: "Tratamiento Medicamentoso",
};

const pieOptions = {
  plugins: {
    legend: {
      display: true,
      position: "top", 
      align: "center",
      labels: {
        boxWidth: 18,
        font: { size: 14 },
        padding: 16,
      },
    },
  },
};

const Graficos = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/estadisticas/", { withCredentials: true })
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Datos para pastel
  const pieData = {
    labels: ["Positivo", "Negativo"],
    datasets: [
      {
        data: [stats.resultado?.si || 0, stats.resultado?.no || 0],
        backgroundColor: [rojo, verde],
        borderWidth: 1,
      },
    ],
  };

  // Datos para pastel de sexo
  const pieSexoData = {
    labels: ["Masculino", "Femenino"],
    datasets: [
      {
        data: [stats.sexo?.masculino || 0, stats.sexo?.femenino || 0],
        backgroundColor: ["#1890ff", "#ff85a1"], // Azul y rosa profesional
        borderWidth: 1,
      },
    ],
  };

  // Datos para barras apiladas
  const barLabels = Object.keys(labelMap).map((key) => labelMap[key]);
  const barSi = Object.keys(labelMap).map((key) => stats[key]?.si || 0);
  const barNo = Object.keys(labelMap).map((key) => stats[key]?.no || 0);

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "Sí",
        data: barSi,
        backgroundColor: rojo,
        stack: "Stack 0",
        borderRadius: 5, 
        barPercentage: 0.9, 
        categoryPercentage: 0.8,
        borderWidth: 2,
        borderColor: "#fff",
      },
      {
        label: "No",
        data: barNo,
        backgroundColor: verde,
        stack: "Stack 0",
        borderRadius: 5,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top", 
        labels: {
          font: { size: 14 },
          padding: 16,
          generateLabels: (chart) => [
            {
              text: "Sí",
              fillStyle: rojo,
              strokeStyle: "#fff",
              lineWidth: 2,
              hidden: false,
              index: 0,
            },
            {
              text: "No",
              fillStyle: verde,
              strokeStyle: "#fff",
              lineWidth: 2,
              hidden: false,
              index: 1,
            },
          ],
        },
      },
      title: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: {
      x: { 
        stacked: true, 
        ticks: { font: { size: 10 } },
        display: false
      },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
      <AntTitle level={2} style={{ textAlign: "center", marginBottom: 32 }}>Estadísticas de Pacientes</AntTitle>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
          <Loading />
        </div>
      ) : (
        <>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Card
                title={<div style={{ textAlign: "center", width: "100%" }}>Distribución por Resultados</div>}
                bordered={false}
                style={{ borderRadius: 12, boxShadow: "0 2px 8px #00000010" }}
                bodyStyle={{ padding: 12, display: "flex", justifyContent: "center" }}
              >
                <div style={{ width: 300 }}>
                  <Pie data={pieData} options={pieOptions} height={50} />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title={<div style={{ textAlign: "center", width: "100%" }}>Distribución por Sexo</div>}
                bordered={false}
                style={{ borderRadius: 12, boxShadow: "0 2px 8px #00000010" }}
                bodyStyle={{ padding: 12, display: "flex", justifyContent: "center" }}
              >
                <div style={{ width: 300 }}>
                  <Pie data={pieSexoData} options={pieOptions} height={50} />
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[32, 32]} style={{ marginTop: 24 }}>
  <Col xs={24}>
    <Card
      title={<div style={{ textAlign: "center", width: "100%" }}>Distribución por Variables</div>}
      bordered={false}
      style={{ borderRadius: 12, boxShadow: "0 2px 8px #00000010" }}
      bodyStyle={{ padding: 16, display: "flex", justifyContent: "center" }} // Centra el contenido
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <Bar
          data={barData}
          options={barOptions}
          height={150}
          width={null}
        />
      </div>
    </Card>
  </Col>
</Row>
        </>
      )}
    </div>
  );
};

export default Graficos;