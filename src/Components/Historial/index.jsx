import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Popconfirm, Input, Space, Typography, Form, Select} from "antd";
import { SearchOutlined, ReloadOutlined, EditFilled, DeleteFilled, FilePdfFilled, FileExcelFilled, FormOutlined } from "@ant-design/icons";
import { showToast } from "../ToastNotification";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";


const { Title } = Typography;

export default function Historial() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    obtenerPacientes();
  }, []);

  const obtenerPacientes = () => {
    setLoading(true);
    axios.get("https://sleepdisorder-detector.duckdns.org/api/api/pacientes/")
      .then((response) => {
        const formattedData = formatData(response.data);
        setData(formattedData);
        setFilteredData(formattedData);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        showToast("Error al obtener los datos", "error");
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
        console.log("Datos enviados al backend:", transformedValues); // Verificar los datos enviados

        // Enviar los datos al modelo de IA
        axios.post("https://sleepdisorder-detector.duckdns.org/api/api/predecir/", { variables: orderedValues }, { withCredentials: true })
          .then((response) => {
            transformedValues.resultado = response.data.prediccion;

            // Actualizar el paciente en el backend
            return axios.put(`https://sleepdisorder-detector.duckdns.org/api/api/pacientes/${editingPatient.id}/`, transformedValues);
          })
          .then(() => {
            obtenerPacientes();
            showToast("Paciente actualizado correctamente", "success");
            setIsEditModalVisible(false);
            setEditingPatient(null);
          })
          .catch((error) => {
            console.error("Error al procesar la solicitud:", error);
            showToast("Error al actualizar el paciente", "error");
          });
      });
};

  const handleDelete = (id) => {
    axios.delete(`https://sleepdisorder-detector.duckdns.org/api/api/pacientes/${id}/`)
      .then(() => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
        showToast("Paciente eliminado correctamente", "success");
      })
      .catch((error) => {
        console.error("Error al eliminar el paciente:", error);
        showToast("Error al eliminar el paciente", "error");
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

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", fixed: "left" },
    { title: "Resultado", dataIndex: "resultado", key: "resultado" },
    { title: "Sexo", dataIndex: "sexo", key: "sexo" },
    { title: "Edad", dataIndex: "edad", key: "edad" },
    { title: () => <div>Antecedentes<br />Patológicos Familiares</div>, dataIndex: "ant_patologicos_fam", key: "ant_patologicos_fam" },
    { title: () => <div>Antecedentes<br />Pre/Pri/PostnatalesPositivos</div>, dataIndex: "ant_pre_peri_postnatales_positivos", key: "ant_pre_peri_postnatales_positivos" },
    { title: () => <div>Alteraciones<br />Anatómicas</div>, dataIndex: "alteraciones_anatomicas", key: "alteraciones_anatomicas" },
    { title: () => <div>Consumo de<br />Medicamentos</div>, dataIndex: "consumo_medicamentos", key: "consumo_medicamentos" },
    { title: () => <div>Consumo de <br />Tóxicos</div>, key: "consumo_toxicos" },
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
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FormOutlined style={{ fontSize: "20px" }}/>}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este paciente?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteFilled style={{ fontSize: "20px" }}/>} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const exportToCSV = () => {
    const headers = [
      "ID", "Resultado", "Sexo", "Edad",
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

  return (
    <div className="container mx-auto py-10 mt-10">
      <Title level={2}>Historial de Pacientes</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={obtenerPacientes}
          loading={loading}
        >
          Recargar
        </Button>
        <Button type="primary" icon={<FileExcelFilled style={{ fontSize: "20px" }}/>} onClick={exportToCSV}>
          Exportar a CSV
        </Button>
        <Button type="primary" icon={<FilePdfFilled style={{ fontSize: "20px" }} />} onClick={exportToPDF}>
          Exportar a PDF
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        rowKey="id"
        footer={() => `Total de registros: ${filteredData.length}`} // Pie de tabla
        size="small"

      />

      <Modal
        title="Editar Paciente"
        visible={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="edad"
            label="Edad"
            rules={[{ required: true, message: "Por favor ingresa la edad" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="sexo"
            label="Sexo"
            rules={[{ required: true, message: "Por favor selecciona el sexo" }]}
          >
            <Select>
              <Select.Option value={0}>Masculino</Select.Option>
              <Select.Option value={1}>Femenino</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ant_patologicos_fam"
            label="Antecedentes Patológicos Familiares"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0}>No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ant_pre_peri_postnatales_positivos"
            label="Antecedentes Pre/Peri/Postnatales Positivos"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="alteraciones_anatomicas"
            label="Alteraciones Anatómicas"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="consumo_medicamentos"
            label="Consumo de Medicamentos"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="consumo_toxicos"
            label="Consumo de tóxicos"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="exp_medios_pantallas"
            label="Exposición a medios de Pantallas"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="trastorno_neurodesarrollo"
            label="Trastornos del Neurodesarrollo"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="obesidad"
            label="Obesidad"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="hipertension_arterial"
            label="Hipertensión arterial"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="trastornos_aprendizaje"
            label="Trastornos del aprendizaje"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="trastornos_comportamiento"
            label="Trastornos del comportamiento"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cefalea"
            label="Cefalea"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="res_insulina"
            label="Resistencia a la insulina"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="depresion"
            label="Depresión"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="higienico_dietetico"
            label="Tratamiento Higiénico/Dietético"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cognitivo_conductual"
            label="Tratamiento Cognitivo/Conductual"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0} >No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="medicamentoso"
            label="Tratamiento medicamentoso"
            rules={[{ required: true, message: "Por favor selecciona una opción" }]}
          >
            <Select>
              <Select.Option value={0}>No</Select.Option>
              <Select.Option value={1}>Sí</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        
      </Modal>
    </div>
  );
}
