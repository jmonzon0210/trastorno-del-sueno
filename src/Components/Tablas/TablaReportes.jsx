function ClassificationReportTable({ report }) {
  if (!report || typeof report === "string") return <pre>{report}</pre>;

  // Filtra las claves que son clases o promedios
  const keys = Object.keys(report).filter(k => !["accuracy"].includes(k));
  const metrics = ["precision", "recall", "f1-score", "support"];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: 4 }}></th>
          {metrics.map(m => (
            <th key={m} style={{ border: "1px solid #ccc", padding: 4 }}>{m}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keys.map(k => (
          <tr key={k}>
            <td style={{ border: "1px solid #ccc", padding: 4, fontWeight: "bold" }}>{k}</td>
            {metrics.map(m => (
              <td key={m} style={{ border: "1px solid #ccc", padding: 4 }}>
                {report[k][m] !== undefined
                  ? (typeof report[k][m] === "number"
                      ? report[k][m].toFixed(3)
                      : report[k][m])
                  : ""}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td style={{ border: "1px solid #ccc", padding: 4, fontWeight: "bold" }}>accuracy</td>
          <td colSpan={metrics.length} style={{ border: "1px solid #ccc", padding: 4 }}>
            {report.accuracy !== undefined ? report.accuracy.toFixed(3) : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ClassificationReportTable;