import { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Select, Button, Modal, Popconfirm, Input, Form, message, Tag, Menu} from "antd";
import { SearchOutlined, MoreOutlined, ReloadOutlined, FilePdfFilled, FileExcelFilled, CheckCircleTwoTone, FilterOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import PacienteForm from "../PacienteForm";
import PredictionModal from "../PredictionModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckCircleOutlined } from "@ant-design/icons";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Tabla from "../Tabla";
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
  const [predictionProb1, setPredictionProb1] = useState(null);
  const [predictionProb0, setPredictionProb0] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [isDiagnosticoModalVisible, setIsDiagnosticoModalVisible] = useState(false);
  const [diagnosticoPaciente, setDiagnosticoPaciente] = useState(null);
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState(null);
  const [current, setCurrent] = useState(0);
  const { user } = useAuth();
  const [soloMisPacientes, setSoloMisPacientes] = useState(false);


    
  useEffect(() => {
    obtenerPacientes();
  }, []);

  const obtenerPacientes = () => {
    setLoading(true);
    axios.get("http://localhost:8000/api/pacientes/", { withCredentials: true })
      .then((response) => {
        const formattedData = formatData(response.data);
        setData(formattedData);
        setFilteredData(formattedData);
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
        console.log("Datos enviados al backend:", transformedValues);
        console.log("Datos enviados al modelo", orderedValues)

        // Enviar los datos al modelo de IA
        return axios.post("http://localhost:8000/api/predecir/", { variables: orderedValues },
          { withCredentials: true })
          .then((response) => {
            setPredictionResult(response.data.prediccion);
            setPredictionProb1(response.data.probabilidad_1);
            setPredictionProb0(response.data.probabilidad_0);
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
          })
          ;
      })
      .catch((error) => {
        console.error("error:", error);
        message.error("Ha ocurrido un error al procesar la solicitud");
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    axios.delete(`http://localhost:8000/api/pacientes/${id}/`, { withCredentials: true })
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
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value.toLowerCase())
      )
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

  return (
    <Menu>
      <Menu.Item
        key="editar"
        onClick={() => esCreador && handleEdit(record)}
        disabled={!esCreador}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ModeEditIcon style={{ fontSize: 18, color: "#1890ff" }} />
          Editar
        </span>
      </Menu.Item>
      <Menu.Item
        key="diagnostico"
        onClick={() => esCreador && handleDiagnostico(record)}
        disabled={!esCreador}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CheckCircleOutlined style={{ fontSize: 18, color: "#52c41a" }} />
          Confirmar Diagnóstico
        </span>
      </Menu.Item>
      <Menu.Item key="eliminar" disabled={!esCreador}>
        <Popconfirm
          title="¿Estás seguro de eliminar este paciente?"
          onConfirm={() => esCreador && handleDelete(record.id)}
          okText="Sí"
          cancelText="No"
          confirmLoading={loading === record.id}
          disabled={!esCreador}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <DeleteIcon style={{ fontSize: 18, color: "#ff4d4f" }} />
            Eliminar
          </span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
};


  const columns = [
    { title: "ID", dataIndex: "id", key: "id", fixed: "left", sorter: (a, b) => a.id - b.id, defaultSortOrder: 'descend', },
    {
      title: "Resultado",
      dataIndex: "resultado",
      key: "resultado",
      render: (text, record) => (
        <span>
          {text === "Positivo" ? (
            <Tag color="red">Positivo</Tag>
          ) : (
            <Tag color="green">Negativo</Tag>
          )}
          {record.diagnostico_real !== null && (
            <CheckCircleTwoTone twoToneColor="#52c41a" title="Diagnóstico verificado" style={{ marginLeft: 6 }} />
          )}
        </span>
      ),
    },
    
    { title: "Sexo", dataIndex: "sexo", key: "sexo" },
    { title: "Edad", dataIndex: "edad", key: "edad" },
    { title: () => <div>Antecedentes<br />Patológicos Familiares</div>, dataIndex: "ant_patologicos_fam", key: "ant_patologicos_fam" },
    { title: () => <div>Antecedentes<br />Pre/Pri/PostnatalesPositivos</div>, dataIndex: "ant_pre_peri_postnatales_positivos", key: "ant_pre_peri_postnatales_positivos" },
    { title: () => <div>Alteraciones<br />Anatómicas</div>, dataIndex: "alteraciones_anatomicas", key: "alteraciones_anatomicas" },
    { title: () => <div>Consumo de<br />Medicamentos</div>, dataIndex: "consumo_medicamentos", key: "consumo_medicamentos" },
    { title: () => <div>Consumo de <br />Tóxicos</div>, dataIndex: "consumo_toxicos", key: "consumo_toxicos" },
    { title: () => <div>Exposición a medios <br />de pantallas</div>, dataIndex: "exp_medios_pantallas", key: "exp_medios_pantallas" },
    { title: () => <div>Trastornos del <br />Neurodesarrollo</div>, dataIndex: "trastorno_neurodesarrollo", key: "trastorno_neurodesarrollo" },
    { title: "Obesidad", dataIndex: "obesidad", key: "obesidad" },
    { title: () => <div>Hipertensión<br />Arterial</div>, dataIndex: "hipertension_arterial", key: "hipertension_arterial" },
    { title: () => <div>Trastornos del <br />aprendizaje</div>, dataIndex: "trastornos_aprendizaje", key: "trastornos_aprendizaje" },
    { title: () => <div>Trastornos del <br />comportamiento</div>, dataIndex: "trastornos_comportamiento", key: "trastornos_comportamiento" },
    { title: "Cefalea", dataIndex: "cefalea", key: "cefalea" },
    { title: () => <div>Resistencia a <br />la insulina</div>, dataIndex: "res_insulina", key: "res_insulina" },
    { title: "Depresión", dataIndex: "depresion", key: "depresion" },
    { title: () => <div>Tratamiento<br />Higiénico/Dietético</div>, dataIndex: "higienico_dietetico", key: "higienico_dietetico" },
    { title: () => <div>Tratamiento <br />Cognitivo/Conductual</div>, dataIndex: "cognitivo_conductual", key: "cognitivo_conductual" },
    { title: () => <div>Tratamiento <br />Medicamentoso</div>, dataIndex: "medicamentoso", key: "medicamentoso" },
    
   {
  title: "",
  key: "acciones",
  fixed: "right",
  render: (_, record) => (
    <Dropdown overlay={menuAcciones(record)} trigger={['click']}>
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
      axios.put(`http://localhost:8000/api/pacientes/${pendingUpdate.id}/`, pendingUpdate, { withCredentials: true })
        .then(() => {
          return axios.patch(`http://localhost:8000/api/pacientes/${pendingUpdate.id}/`, {
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
        `http://localhost:8000/api/pacientes/${diagnosticoPaciente.id}/`,
        {
          resultado: nuevoDiagnostico,
          diagnostico_real: nuevoDiagnostico,
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
      

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 mt-4 mb-4">
      <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar..."
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
            confirmLoading={loading}
          >
            {soloMisPacientes ? "Ver todos" : "Filtrar mis pacientes"}
          </Button>
          <Button
          
            icon={<FileExcelFilled style={{ fontSize: "20px" }} />}
            onClick={exportToCSV}
            className="w-full sm:w-auto"
            style={{ background: "#d9f7be", borderColor: "#b7eb8f", color: "#000000" }}
            confirmLoading={loading}
          >
            Exportar a CSV
          </Button>
          <Button
          
            icon={<FilePdfFilled style={{ fontSize: "20px" }} />}
            onClick={exportToPDF}
            className="w-full sm:w-auto"
            style={{ background: "#fff1f0", borderColor: "#ffa39e", color: "#000000" }}
            confirmLoading={loading}
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
      >
        <PacienteForm form={form} initialValues={editingPatient} onFinish={handleEditSubmit} loading={loading} current={current} setCurrent={setCurrent}/>
      </Modal>

      <PredictionModal
        visible={isPredictionModalVisible}
        onOk={handlePrediction}
        onCancel={() => setIsPredictionModalVisible(false)}
        predictionResult={predictionResult}
        predictionProb1={predictionProb1}
        predictionProb0={predictionProb0}
        okText={"Actualizar"}
        cancelText={"Cerrar"}
        confirmLoading={loading}
      />
    </div>
  );
}