import React from "react";
import ClassificationReportTable from "../Tablas/TablaReportes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

export default function DetalleModal({ modalType, modalData }) {
  if (modalType === "reporte") {
    return (
      <>
        <ClassificationReportTable report={modalData.classification_report_test} />
      </>
    );
  }
  if (modalType === "matriz") {
    const matrix = modalData.confusion_matrix_test;
    // Tamaño fijo para asegurar cuadrados
    const cellSize = 70;
    return (
      <>
        {Array.isArray(matrix) && matrix.length === 2 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <table style={{ borderCollapse: "collapse", margin: "0 auto", background: "#fafbfc" }}>
              <tbody>
                <tr>
                  <td style={{
                    border: "1px solid #e0e0e0",
                    background: "#e6f7ff",
                    padding: 0,
                    width: cellSize,
                    height: cellSize,
                    fontWeight: 600,
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}>
                    <div>TN</div>
                    <div style={{ fontSize: 18 }}>{matrix[0][0]}</div>
                  </td>
                  <td style={{
                    border: "1px solid #e0e0e0",
                    background: "#fffbe6",
                    padding: 0,
                    width: cellSize,
                    height: cellSize,
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}>
                    <div>FP</div>
                    <div style={{ fontSize: 18 }}>{matrix[0][1]}</div>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    border: "1px solid #e0e0e0",
                    background: "#fffbe6",
                    padding: 0,
                    width: cellSize,
                    height: cellSize,
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}>
                    <div>FN</div>
                    <div style={{ fontSize: 18 }}>{matrix[1][0]}</div>
                  </td>
                  <td style={{
                    border: "1px solid #e0e0e0",
                    background: "#e6f7ff",
                    padding: 0,
                    width: cellSize,
                    height: cellSize,
                    fontWeight: 600,
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}>
                    <div>TP</div>
                    <div style={{ fontSize: 18 }}>{matrix[1][1]}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          "-"
        )}
      </>
    );
  }
  if (modalType === "importancia") {
    const importancias = modalData.importancia_caracteristicas || [];
    return (
      <>
        <div style={{ width: "90%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={importancias}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 1]}
                tickFormatter={(value) => value * 100}
              />
              <YAxis dataKey="feature" type="category" width={120} />
              <Tooltip formatter={(value) => value * 100} />
              <Bar dataKey="importance" fill="#1890ff">
                <LabelList dataKey="importance" position="right" formatter={(val) => (val * 100).toFixed(2)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }
  return null;
}