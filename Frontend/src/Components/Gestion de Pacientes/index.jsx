
import { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Select, Button, Modal, Popconfirm, Input, Form, message, Tag, Menu} from "antd";
import { SearchOutlined, MoreOutlined, ReloadOutlined, FilePdfFilled, FileExcelFilled, CheckCircleTwoTone, FilterOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import PacienteForm from "./FormularioPacientes";
import PredictionModal from "../PredictionModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckCircleOutlined } from "@ant-design/icons";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Tabla from "../Tablas/Tabla";
import { useAuth } from "../../context";

export default function Historial() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();
  const [isPredictionModalVisible, setIsPredictionModalVisible] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionProb, setPredictionProb] = useState(null);
  const [savedPatientId, setSavedPatientId] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [isDiagnosticoModalVisible, setIsDiagnosticoModalVisible] = useState(false);
  const [diagnosticoPaciente, setDiagnosticoPaciente] = useState(null);
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState(null);
  const [current, setCurrent] = useState(0);
  const { user } = useAuth();
  const [soloMisPacientes, setSoloMisPacientes] = useState(false);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);


    
  useEffect(() => {
    obtenerPacientes();
  }, []);

  const obtenerPacientes = () => {
    setLoading(true);
    axios.get("http://localhost:8000/api/pacientes/", { withCredentials: true })
      .then((response) => {
        const formattedData = formatData(response.data);
        setData(formattedData);
        // Si el filtro de "solo mis pacientes" está activo, filtra aquí
        if (soloMisPacientes && user) {
          setFilteredData(formattedData.filter(p => String(p.creado_por) === String(user.id)));
        } else {
          setFilteredData(formattedData);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        message.error("Error al obtener los datos del servidor");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatData = (data) => {
    return data.map((item) => ({
      key: item.id,
      id: item.id,
      resultado: item.resultado ? "Positivo" : "Negativo",
      confianza_prediccion: item.confianza_prediccion, // <-- Agrega esto
      sexo: item.sexo===0 ? "Masculino" : "Femenino",
      edad: item.edad,
      ant_patologicos_fam: item.ant_patologicos_fam ? "Sí" : "No",
      ant_pre_peri_postnatales_positivos: item.ant_pre_peri_postnatales_positivos ? "Sí" : "No",
      alteraciones_anatomicas: item.alteraciones_anatomicas ? "Sí" : "No",
      consumo_medicamentos: item.consumo_medicamentos ? "Sí" : "No",
      consumo_toxicos: item.consumo_toxicos ? "Sí" : "No",
      exp_medios_pantallas: item.exp_medios_pantallas ? "Sí" : "No",
      trastorno_neurodesarrollo: item.trastorno_neurodesarrollo ? "Sí" : "No",
      obesidad: item.obesidad ? "Sí" : "No",
      hipertension_arterial: item.hipertension_arterial ? "Sí" : "No",
      trastornos_aprendizaje: item.trastornos_aprendizaje ? "Sí" : "No",
      trastornos_comportamiento: item.trastornos_comportamiento ? "Sí" : "No",
      cefalea: item.cefalea ? "Sí" : "No",
      res_insulina: item.res_insulina ? "Sí" : "No",
      depresion: item.depresion ? "Sí" : "No",
      higienico_dietetico: item.higienico_dietetico ? "Sí" : "No",
      cognitivo_conductual: item.cognitivo_conductual ? "Sí" : "No",
      medicamentoso: item.medicamentoso ? "Sí" : "No",
      diagnostico_real: item.diagnostico_real, // <-- AGREGA ESTA LÍNEA
      creado_por: item.creado_por,
    }));
  };

  const handleEdit = (record) => {
    setEditingPatient(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields()
      .then((values) => {
        setLoading(true);
        // Transformar los valores "Sí"/"No" a 1/0
        const transformedValues = {
          ...values,
          sexo: values.sexo === "Femenino" || values.sexo === 1 ? 1 : 0,
          edad: parseInt(values.edad),
          resultado: values.resultado === "Positivo" || values.resultado === 1 ? 1 : 0,
          ant_patologicos_fam: values.ant_patologicos_fam === "Sí" || values.ant_patologicos_fam === 1 ? 1 : 0,
          ant_pre_peri_postnatales_positivos: values.ant_pre_peri_postnatales_positivos === "Sí" || values.ant_pre_peri_postnatales_positivos === 1 ? 1 : 0,
          alteraciones_anatomicas: values.alteraciones_anatomicas === "Sí" || values.alteraciones_anatomicas === 1 ? 1 : 0,
          consumo_medicamentos: values.consumo_medicamentos === "Sí" || values.consumo_medicamentos === 1 ? 1 : 0,
          consumo_toxicos: values.consumo_toxicos === "Sí" || values.consumo_toxicos === 1 ? 1 : 0,
          exp_medios_pantallas: values.exp_medios_pantallas === "Sí" || values.exp_medios_pantallas === 1 ? 1 : 0,
          trastorno_neurodesarrollo: values.trastorno_neurodesarrollo === "Sí" || values.trastorno_neurodesarrollo === 1 ? 1 : 0,
          obesidad: values.obesidad === "Sí" || values.obesidad === 1 ? 1 : 0,
          hipertension_arterial: values.hipertension_arterial === "Sí" || values.hipertension_arterial === 1 ? 1 : 0,
          trastornos_aprendizaje: values.trastornos_aprendizaje === "Sí" || values.trastornos_aprendizaje === 1 ? 1 : 0,
          trastornos_comportamiento: values.trastornos_comportamiento === "Sí" || values.trastornos_comportamiento === 1 ? 1 : 0,
          cefalea: values.cefalea === "Sí" || values.cefalea === 1 ? 1 : 0,
          res_insulina: values.res_insulina === "Sí" || values.res_insulina === 1 ? 1 : 0,
          depresion: values.depresion === "Sí" || values.depresion === 1 ? 1 : 0,
          higienico_dietetico: values.higienico_dietetico === "Sí" || values.higienico_dietetico === 1 ? 1 : 0,
          cognitivo_conductual: values.cognitivo_conductual === "Sí" || values.cognitivo_conductual === 1 ? 1 : 0,
          medicamentoso: values.medicamentoso === "Sí" || values.medicamentoso === 1 ? 1 : 0,
        };

        // Ordenar las variables para el modelo de IA
        const orderedValues = [
          transformedValues.sexo,
          transformedValues.edad,
          transformedValues.ant_patologicos_fam,
          transformedValues.ant_pre_peri_postnatales_positivos,
          transformedValues.alteraciones_anatomicas,
          transformedValues.consumo_medicamentos,
          transformedValues.consumo_toxicos,
          transformedValues.exp_medios_pantallas,
          transformedValues.trastorno_neurodesarrollo,
          transformedValues.obesidad,
          transformedValues.hipertension_arterial,
          transformedValues.trastornos_aprendizaje,
          transformedValues.trastornos_comportamiento,
          transformedValues.cefalea,
          transformedValues.res_insulina,
          transformedValues.depresion,
          transformedValues.higienico_dietetico,
          transformedValues.cognitivo_conductual,
          transformedValues.medicamentoso,
        ];

        // Enviar los datos al modelo de IA
        return axios.post("http://localhost:8000/api/predecir/", { variables: orderedValues },
          { withCredentials: true })
          .then((response) => {
            setPredictionResult(response.data.prediccion);
            setPredictionProb(response.data.probabilidad); // Usa el campo correcto como en EvalForm
            setPendingUpdate({ ...transformedValues, id: editingPatient.id, resultado: response.data.prediccion });
            setIsEditModalVisible(false);
            setIsPredictionModalVisible(true);
            setLoading(false);
            setCurrent(0);
          })
          .catch((error) => {
            console.error("Error al procesar la solicitud:", error);
            message.error("Error al procesar la solicitud");
            setLoading(false);
            setCurrent(0)
          });
      })
      .catch((error) => {
        console.error("error:", error);
        message.error("Ha ocurrido un error al procesar la solicitud");
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    axios.delete(`http://localhost:8000/api/pacientes/${id}/eliminar/`, { withCredentials: true })
      .then(() => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("Paciente eliminado correctamente");
      })
      .catch((error) => {
        console.error("Error al eliminar el paciente:", error);
        message.error("Error al eliminar el paciente");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (value) => {
    const filtered = data.filter((item) =>
      String(item.id).toLowerCase().includes(value.toLowerCase())
    );
    setSearchText(value);
    setFilteredData(filtered);
  };
  const handleDiagnostico= (record) => {
  setDiagnosticoPaciente(record);
  setNuevoDiagnostico(record.resultado === "Positivo" ? 1 : 0);
  setIsDiagnosticoModalVisible(true);
};

 const menuAcciones = (record) => {
  const esCreador = String(record.creado_por) === String(user?.id);

  return {
    items: [
      {
        key: "editar",
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ModeEditIcon style={{ fontSize: 18, color: "#1890ff" }} />
            Editar
          </span>
        ),
        onClick: () => esCreador && handleEdit(record),
        disabled: !esCreador,
      },
      {
        key: "diagnostico",
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircleOutlined style={{ fontSize: 18, color: "#52c41a" }} />
            Confirmar Diagnóstico
          </span>
        ),
        onClick: () => esCreador && handleDiagnostico(record),
        disabled: !esCreador,
      },
      {
        key: "eliminar",
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <DeleteIcon style={{ fontSize: 18, color: "#ff4d4f" }} />
            Eliminar
          </span>
        ),
        disabled: !esCreador,
        onClick: () => {}, // Evita warning de onClick vacío
      },
    ],
  };
};



// Utilidad para generar filtros únicos para cada columna
const getColumnFilters = (dataIndex) => {
  const uniqueValues = [...new Set(data.map(item => item[dataIndex]))].filter(v => v !== undefined && v !== null);
  return uniqueValues.map(val => ({
    text: String(val),
    value: val,
  }));
};

const columns = [
  { 
    title: "ID", 
    dataIndex: "id", 
    key: "id", 
    fixed: "left", 
    sorter: (a, b) => a.id - b.id, 
    defaultSortOrder: 'descend',
    filters: getColumnFilters("id"),
    onFilter: (value, record) => String(record.id) === String(value),
  },
 {
  title: "Resultado",
  dataIndex: "resultado",
  key: "resultado",
  filters: getColumnFilters("resultado"),
  onFilter: (value, record) => record.resultado === value,
  align: "center",
render: (text, record) => (
  <span>
    {text === "Positivo" ? (
      <Tag color="red">
        Positivo
        {record.confianza_prediccion !== undefined && record.confianza_prediccion !== null &&
          ` ${(record.confianza_prediccion * 100).toFixed(2)}%`
        }
      </Tag>
    ) : (
      <Tag color="green">
        Negativo
        {record.confianza_prediccion !== undefined && record.confianza_prediccion !== null &&
          ` ${(record.confianza_prediccion * 100).toFixed(2)}%`
        }
      </Tag>
    )}
    {record.diagnostico_real !== null && (
      <CheckCircleTwoTone twoToneColor="#52c41a" title="Diagnóstico verificado" style={{ marginLeft: 6 }} />
    )}
  </span>
),
},
  { 
    title: "Sexo", 
    dataIndex: "sexo", 
    key: "sexo", 
    filters: getColumnFilters("sexo"), 
    onFilter: (value, record) => record.sexo === value 
  },
  { 
    title: "Edad", 
    dataIndex: "edad", 
    key: "edad", 
    filters: getColumnFilters("edad"), 
    onFilter: (value, record) => String(record.edad) === String(value) 
  },
  { 
    title: () => <div>Antecedentes<br />Patológicos Familiares</div>, 
    dataIndex: "ant_patologicos_fam", 
    key: "ant_patologicos_fam", 
    filters: getColumnFilters("ant_patologicos_fam"), 
    onFilter: (value, record) => record.ant_patologicos_fam === value 
  },
  { 
    title: () => <div>Antecedentes<br />Pre/Pri/PostnatalesPositivos</div>, 
    dataIndex: "ant_pre_peri_postnatales_positivos", 
    key: "ant_pre_peri_postnatales_positivos",
    filters: getColumnFilters("ant_pre_peri_postnatales_positivos"),
    onFilter: (value, record) => record.ant_pre_peri_postnatales_positivos === value
  },
  { 
    title: () => <div>Alteraciones<br />Anatómicas</div>, 
    dataIndex: "alteraciones_anatomicas", 
    key: "alteraciones_anatomicas",
    filters: getColumnFilters("alteraciones_anatomicas"),
    onFilter: (value, record) => record.alteraciones_anatomicas === value
  },
  { 
    title: () => <div>Consumo de<br />Medicamentos</div>, 
    dataIndex: "consumo_medicamentos", 
    key: "consumo_medicamentos",
    filters: getColumnFilters("consumo_medicamentos"),
    onFilter: (value, record) => record.consumo_medicamentos === value
  },
  { 
    title: () => <div>Consumo de <br />Tóxicos</div>, 
    dataIndex: "consumo_toxicos", 
    key: "consumo_toxicos",
    filters: getColumnFilters("consumo_toxicos"),
    onFilter: (value, record) => record.consumo_toxicos === value
  },
  { 
    title: () => <div>Exposición a medios <br />de pantallas</div>, 
    dataIndex: "exp_medios_pantallas", 
    key: "exp_medios_pantallas",
    filters: getColumnFilters("exp_medios_pantallas"),
    onFilter: (value, record) => record.exp_medios_pantallas === value
  },
  { 
    title: () => <div>Trastornos del <br />Neurodesarrollo</div>, 
    dataIndex: "trastorno_neurodesarrollo", 
    key: "trastorno_neurodesarrollo",
    filters: getColumnFilters("trastorno_neurodesarrollo"),
    onFilter: (value, record) => record.trastorno_neurodesarrollo === value
  },
  { 
    title: "Obesidad", 
    dataIndex: "obesidad", 
    key: "obesidad",
    filters: getColumnFilters("obesidad"),
    onFilter: (value, record) => record.obesidad === value
  },
  { 
    title: () => <div>Hipertensión<br />Arterial</div>, 
    dataIndex: "hipertension_arterial", 
    key: "hipertension_arterial",
    filters: getColumnFilters("hipertension_arterial"),
    onFilter: (value, record) => record.hipertension_arterial === value
  },
  { 
    title: () => <div>Trastornos del <br />aprendizaje</div>, 
    dataIndex: "trastornos_aprendizaje", 
    key: "trastornos_aprendizaje",
    filters: getColumnFilters("trastornos_aprendizaje"),
    onFilter: (value, record) => record.trastornos_aprendizaje === value
  },
  { 
    title: () => <div>Trastornos del <br />comportamiento</div>, 
    dataIndex: "trastornos_comportamiento", 
    key: "trastornos_comportamiento",
    filters: getColumnFilters("trastornos_comportamiento"),
    onFilter: (value, record) => record.trastornos_comportamiento === value
  },
  { 
    title: "Cefalea", 
    dataIndex: "cefalea", 
    key: "cefalea",
    filters: getColumnFilters("cefalea"),
    onFilter: (value, record) => record.cefalea === value
  },
  { 
    title: () => <div>Resistencia a <br />la insulina</div>, 
    dataIndex: "res_insulina", 
    key: "res_insulina",
    filters: getColumnFilters("res_insulina"),
    onFilter: (value, record) => record.res_insulina === value
  },
  { 
    title: "Depresión", 
    dataIndex: "depresion", 
    key: "depresion",
    filters: getColumnFilters("depresion"),
    onFilter: (value, record) => record.depresion === value
  },
  { 
    title: () => <div>Tratamiento<br />Higiénico/Dietético</div>, 
    dataIndex: "higienico_dietetico", 
    key: "higienico_dietetico",
    filters: getColumnFilters("higienico_dietetico"),
    onFilter: (value, record) => record.higienico_dietetico === value
  },
  { 
    title: () => <div>Tratamiento <br />Cognitivo/Conductual</div>, 
    dataIndex: "cognitivo_conductual", 
    key: "cognitivo_conductual",
    filters: getColumnFilters("cognitivo_conductual"),
    onFilter: (value, record) => record.cognitivo_conductual === value
  },
  { 
    title: () => <div>Tratamiento <br />Medicamentoso</div>, 
    dataIndex: "medicamentoso", 
    key: "medicamentoso",
    filters: getColumnFilters("medicamentoso"),
    onFilter: (value, record) => record.medicamentoso === value
  },
 
 {
  title: "",
  key: "acciones",
  fixed: "right",
  render: (_, record) => (
    <Dropdown
      menu={{
        items: [
          {
            key: "editar",
            label: (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#000" // texto siempre negro
                }}
                onClick={() => String(record.creado_por) === String(user?.id) && handleEdit(record)}
              >
                <ModeEditIcon style={{ fontSize: 18, color: String(record.creado_por) === String(user?.id) ? "#1890ff" : "#ccc" }} />
                Editar
              </span>
            ),
            disabled: String(record.creado_por) !== String(user?.id),
          },
          {
            key: "diagnostico",
            label: (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#000" // texto siempre negro
                }}
                onClick={() => String(record.creado_por) === String(user?.id) && handleDiagnostico(record)}
              >
                <CheckCircleOutlined style={{ fontSize: 18, color: String(record.creado_por) === String(user?.id) ? "#52c41a" : "#ccc" }} />
                Confirmar Diagnóstico
              </span>
            ),
            disabled: String(record.creado_por) !== String(user?.id),
          },
          {
            key: "eliminar",
            label: (
              <Popconfirm
                title="¿Seguro que deseas eliminar este paciente?"
                onConfirm={() => handleDelete(record.id)}
                okText="Sí"
                cancelText="No"
                disabled={String(record.creado_por) !== String(user?.id)}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#000" // texto siempre negro
                  }}
                >
                  <DeleteIcon style={{ fontSize: 18, color: String(record.creado_por) === String(user?.id) ? "#ff4d4f" : "#ccc" }} />
                  Eliminar
                </span>
              </Popconfirm>
            ),
            disabled: String(record.creado_por) !== String(user?.id),
          },
        ],
      }}
      trigger={['click']}
    >
      <Button
        shape="circle"
        icon={<MoreOutlined style={{ fontSize: 20, color: "#555" }} />}
        style={{
          background: "#f0f0f0",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Dropdown>
  ),
},
];
  const exportToCSV = () => {
    const headers = [
      "ID", "Resultado", "Confirmado", "Sexo", "Edad",
      "AF", "APPPP", "AA",
      "CM", "CT", "EMP",
      "TND", "OB", "HA",
      "TA", "TC", "CEF",
      "RI", "DEP", "THD",
      "TCC", "TM"
    ];
  
    const csvData = filteredData.map((row) => ({
      ID: row.id,
      Resultado: row.resultado,
      Confirmado: row.diagnostico_real,
      Sexo: row.sexo,
      Edad: row.edad,
      AF: row.ant_patologicos_fam,
      APPPP: row.ant_pre_peri_postnatales_positivos,
      AA: row.alteraciones_anatomicas,
      CM: row.consumo_medicamentos,
      CT: row.consumo_toxicos,
      EMP: row.exp_medios_pantallas,
      TND: row.trastorno_neurodesarrollo,
      OB: row.obesidad,
      HA: row.hipertension_arterial,
      TA: row.trastornos_aprendizaje,
      TC: row.trastornos_comportamiento,
      CEF: row.cefalea,
      RI: row.res_insulina,
      DEP: row.depresion,
      THD: row.higienico_dietetico,
      TCC: row.cognitivo_conductual,
      TM: row.medicamentoso
    }));
  
    const csv = Papa.unparse({
      fields: headers,
      data: csvData
    });
  
    // Agregar BOM para compatibilidad con caracteres especiales
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "historial_pacientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const exportToPDF = () => {
     const doc = new jsPDF({
       orientation: "landscape", // Orientación vertical
       
     });
     doc.text("Historial de Pacientes", 20, 10); // Título del PDF
      // Generar la tabla en el PDF
      const headers = [
       "ID", "Resultado", "Sexo", "Edad",
       "AF", "APPPP", "AA",
       "CM", "CT", "EMP",
       "TND", "OB", "HA",
       "TA", "TC", "CEF",
       "RI", "DEP", "THD",
       "TCC", "TM"
     ];
     const body = filteredData.map((row) => [
       row.id, row.resultado, row.sexo, row.edad,
       row.ant_patologicos_fam, row.ant_pre_peri_postnatales_positivos, row.alteraciones_anatomicas,
       row.consumo_medicamentos, row.consumo_toxicos, row.exp_medios_pantallas,
       row.trastorno_neurodesarrollo, row.obesidad, row.hipertension_arterial,
       row.trastornos_aprendizaje, row.trastornos_comportamiento, row.cefalea,
       row.res_insulina, row.depresion, row.higienico_dietetico,
       row.cognitivo_conductual, row.medicamentoso
     ]);
   
      doc.autoTable({
       head: [headers], // Encabezados de las columnas
       body: body,
       startY: 20
     });
 
     doc.save("historial_pacientes.pdf"); // Descargar el archivo PDF
   };
   
   const filtrarMisPacientes = () => {
      if (!user) return; // Si no hay usuario autenticado, no filtrar
      if (!soloMisPacientes) {
        setFilteredData(data.filter(p => String(p.creado_por) === String(user.id)));
      } else {
        setFilteredData(data); // Mostrar todos
      }
      setSoloMisPacientes(!soloMisPacientes);
    };
  

  // Lógica separada para el botón OK del PredictionModal
  const handlePrediction= () => {
    if (pendingUpdate) {
      setLoading(true);
      axios.put(`http://localhost:8000/api/pacientes/${pendingUpdate.id}/actualizar/`, pendingUpdate, { withCredentials: true })
        .then(() => {
          return axios.patch(`http://localhost:8000/api/pacientes/${pendingUpdate.id}/actualizar/`, {
            confianza_prediccion: predictionProb,
            diagnostico_real: null
          }, { withCredentials: true });
        })
        .then(() => {
          message.success("Paciente actualizado correctamente");
          setIsPredictionModalVisible(false);
          obtenerPacientes();
        })
        .catch((error) => {
          console.error("Error al actualizar el paciente:", error);
          message.error("Error al actualizar el paciente");
        })
        .finally(() => {
          setPendingUpdate(null);
          setIsPredictionModalVisible(false);
          setLoading(false);
        });
    } else {
      setIsPredictionModalVisible(false);
    }
  };

  const handleconfirmdiag = async () => {
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/pacientes/${diagnosticoPaciente.id}/actualizar/`,
        {
          resultado: nuevoDiagnostico,
          diagnostico_real: nuevoDiagnostico,
          confianza_prediccion: 1.00,
          incluido_en_reentrenamiento: false
        },
        { withCredentials: true }
      );
      message.success("Diagnóstico actualizado correctamente");
      setIsDiagnosticoModalVisible(false);
      await obtenerPacientes();
    } catch (error) {
      message.error("Error al actualizar el diagnóstico");
    } finally {
      setLoading(false);
    }
  };
      

// Función para mostrar métricas al seleccionar en el menú
const handleShowMetrics = async (metricType) => {
  setLoadingMetrics(true);
  setSelectedMetric(metricType);
  try {
    const resp = await axios.get(
      "http://localhost:8000/api/metricas_modelo_actual/",
      { withCredentials: true }
    );
    setMetrics(resp.data);
    setMetricsVisible(true);
  } catch {
    setMetrics({ error: "No se pudieron obtener las métricas." });
    setMetricsVisible(true);
  }
  setLoadingMetrics(false);
};

// Menú de métricas que usa handleShowMetrics
const metricsMenu = (
  <Menu
    onClick={({ key }) => handleShowMetrics(key)}
    items={[
      { key: "reporte", label: "Reporte de Clasificación" },
      { key: "matriz", label: "Matriz de Confusión" },
      { key: "importancia", label: "Top 5 características" },
    ]}
  />
);

const handleClosePredictionModal = () => {
  setIsPredictionModalVisible(false);
  setSavedPatientId(null);
  setPredictionResult(null);
  setPredictionProb(null);
  setPendingUpdate(null);
  setCurrent(0);
};

// Efecto para cargar métricas automáticamente al abrir el modal de predicción
useEffect(() => {
  if (isPredictionModalVisible) {
    (async () => {
      setLoadingMetrics(true);
      try {
        const resp = await fetch(
          "http://localhost:8000/api/metricas_modelo_actual/",
          { credentials: "include" }
        );
        const data = await resp.json();
        setMetrics(data);
      } catch {
        setMetrics({ error: "No se pudieron obtener las métricas." });
      }
      setLoadingMetrics(false);
    })();
  }
}, [isPredictionModalVisible]);




  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 mt-4 mb-4">
      <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar por ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-72"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={obtenerPacientes}
            loading={loading}
            className="w-full sm:w-auto"
          >
            Recargar
          </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto historial-btn-group">
          <Button
          
            icon={<FilterOutlined style={{ fontSize: "20px" }} />}
            onClick={filtrarMisPacientes}
            className="w-full sm:w-auto"
            style={{
             background: "#bbfefc", borderColor: "#91caff", color: "#000000"
            }}
          >
            {soloMisPacientes ? "Ver todos" : "Filtrar mis pacientes"}
          </Button>
          <Button
          
            icon={<FileExcelFilled style={{ fontSize: "20px" }} />}
            onClick={exportToCSV}
            className="w-full sm:w-auto"
            style={{ background: "#d9f7be", borderColor: "#b7eb8f", color: "#000000" }}
            
          >
            Exportar a CSV
          </Button>
          <Button
          
            icon={<FilePdfFilled style={{ fontSize: "20px" }} />}
            onClick={exportToPDF}
            className="w-full sm:w-auto"
            style={{ background: "#fff1f0", borderColor: "#ffa39e", color: "#000000" }}
            
          >
            Exportar a PDF
          </Button>
        </div>
        </div>
       
      <Tabla
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        footer={() => `Total de pacientes: ${filteredData.length}`}
      />
       
    <Modal
      title="Cambiar o confirmar diagnóstico"
      visible={isDiagnosticoModalVisible}
      onCancel={() => setIsDiagnosticoModalVisible(false)}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <b>Diagnóstico actual:</b>
        <br />
        <Select
          value={nuevoDiagnostico}
          style={{ width: "100%", marginTop: 8 }}
          onChange={value => setNuevoDiagnostico(value)}
        >
          <Select.Option value={1}>Positivo</Select.Option>
          <Select.Option value={0}>Negativo</Select.Option>
        </Select>
      </div>
         <Popconfirm
              title="¿Estás seguro de cambiar o confirmar el diagnóstico?"
              onConfirm={async () => {
                 handleconfirmdiag();
              }}
              okText="Sí"
              cancelText="No"
              confirmLoading={loading}
            >
              <Button type="primary" block loading={loading}>
                Confirmar
              </Button>
            </Popconfirm>
    </Modal>
   
    <Modal
        
        title="Editar Paciente"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={900}
      >
           <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">

        <PacienteForm form={form} initialValues={editingPatient} onFinish={handleEditSubmit} loading={loading} current={current} setCurrent={setCurrent}/>
        </div>
      </Modal>
      

      <PredictionModal
        visible={isPredictionModalVisible}
        onOk={pendingUpdate ? handlePrediction : handleClosePredictionModal}
        onCancel={handleClosePredictionModal}
        predictionResult={predictionResult}
        predictionProb={predictionProb}
        savedPatientId={savedPatientId}
        okText={pendingUpdate ? "Actualizar" : "Cerrar"}
        cancelText={pendingUpdate ? "Cerrar" : null}
        confirmLoading={loading}
        metrics={metrics}
        metricsVisible={metricsVisible}
        setMetricsVisible={setMetricsVisible}
        loadingMetrics={loadingMetrics}
        metricsMenu={metricsMenu}
        selectedMetric={selectedMetric}
      />
    </div>
  );
}