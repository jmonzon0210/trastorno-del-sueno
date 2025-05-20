import { Form, Select, InputNumber, Input, Button, Steps, message, Row, Col } from "antd";
import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const { Step } = Steps;

const stepsConfig = [
  { title: "Antecedentes Médicos", fields: ["nombre_completo", "carnet_identidad","sexo", "edad"] },
  { title: "Factores de Riesgo", fields: ["ant_patologicos_fam", "ant_pre_peri_postnatales_positivos", "alteraciones_anatomicas", "consumo_medicamentos", "consumo_toxicos", "exp_medios_pantallas"] },
  { title: "Consecuencias", fields: ["trastorno_neurodesarrollo", "obesidad", "hipertension_arterial", "trastornos_aprendizaje", "trastornos_comportamiento", "res_insulina", "cefalea", "depresion"] },
  { title: "Tratamientos", fields: ["higienico_dietetico", "cognitivo_conductual", "medicamentoso"] },
];

export default function PacienteForm({ form, initialValues, onFinish, steps = stepsConfig }) {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const next = async () => {
    try {
      await form.validateFields(steps[current].fields);
      setCurrent(current + 1);
    } catch {
      message.error("Por favor completa los campos requeridos");
    }
  };

  const prev = () => setCurrent(current - 1);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await onFinish(values);
      setCurrent(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Steps current={current} className="mb-4">
        {steps.map((s) => <Step key={s.title} title={s.title} />)}
      </Steps>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        {/* Paso 0 */}
        <div style={{ display: current === 0 ? "block" : "none", width: "100%" }}>
        <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nombre_completo"
                label="Nombre Completo"
                rules={[{ required: true, message: "Por favor ingresa el nombre completo" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              </Col>
              <Col span={12}>
              
             
            <Form.Item
              name="carnet_identidad"
              label="Carnet de Identidad"
              rules={[
                { required: true, message: "Por favor ingresa el Carnet de Identidad" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (!/^\d{11}$/.test(value)) {
                      return Promise.reject("El carnet debe tener 11 dígitos numéricos");
                    }
                    const aa = value.substring(0, 2);
                    const mm = value.substring(2, 4);
                    const dd = value.substring(4, 6);

                    const hoy = new Date();
                    const yearActual = hoy.getFullYear();
                    const yearCorto = parseInt(aa, 10);

                    let year;
                    if (yearCorto + 2000 <= yearActual && yearCorto + 2000 >= yearActual - 18) {
                      year = yearCorto + 2000;
                    } else {
                      year = yearCorto + 1900;
                    }

                    const month = parseInt(mm, 10) - 1;
                    const day = parseInt(dd, 10);
                    const fechaNacimiento = new Date(year, month, day);

                    if (
                      fechaNacimiento.getFullYear() !== year ||
                      fechaNacimiento.getMonth() !== month ||
                      fechaNacimiento.getDate() !== day
                    ) {
                      return Promise.reject("La fecha en el carnet no es válida");
                    }

                    const edad = yearActual - fechaNacimiento.getFullYear() - (hoy < new Date(yearActual, month, day) ? 1 : 0);
                    if (edad < 0 || edad > 18) {
                      return Promise.reject("El paciente debe tener entre 0 y 18 años");
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                style={{ width: "100%" }}
                maxLength={11}
                onChange={e => {
                  const value = e.target.value;
                  if (/^\d{11}$/.test(value)) {
                    const aa = value.substring(0, 2);
                    const mm = value.substring(2, 4);
                    const dd = value.substring(4, 6);

                    const hoy = new Date();
                    const yearActual = hoy.getFullYear();
                    const yearCorto = parseInt(aa, 10);

                    let year;
                    if (yearCorto + 2000 <= yearActual && yearCorto + 2000 >= yearActual - 18) {
                      year = yearCorto + 2000;
                    } else {
                      year = yearCorto + 1900;
                    }

                    const month = parseInt(mm, 10) - 1;
                    const day = parseInt(dd, 10);
                    const fechaNacimiento = new Date(year, month, day);

                    const edad = yearActual - fechaNacimiento.getFullYear() - (hoy < new Date(yearActual, month, day) ? 1 : 0);
                    if (
                      fechaNacimiento.getFullYear() === year &&
                      fechaNacimiento.getMonth() === month &&
                      fechaNacimiento.getDate() === day &&
                      edad >= 0 && edad <= 18
                    ) {
                      form.setFieldsValue({ edad }); // Esto actualiza el campo edad
                    } else {
                      form.setFieldsValue({ edad: undefined }); // Limpia si no es válido
                    }
                  } else {
                    form.setFieldsValue({ edad: undefined }); // Limpia si no es válido
                  }
                }}
              />
            </Form.Item>

            </Col>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="edad"
                label="Edad"
                rules={[
                  { required: true, message: "Ingresa la edad" },
                  { type: "number", min: 0, max: 18, message: "0–18 años" },
                ]}
              >
              <InputNumber style={{ width: "100%" }} disabled/>
              </Form.Item>
            </Col>
          </Row>
          </div>
        {/* Paso 1 */}
        <div style={{ display: current === 1 ? "block" : "none", width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ant_patologicos_fam"
                label="Antecedentes Patológicos Familiares"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ant_pre_peri_postnatales_positivos"
                label="Antecedentes Pre/Peri/Postnatales Positivos"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="alteraciones_anatomicas"
                label="Alteraciones Anatómicas"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="consumo_medicamentos"
                label="Consumo de Medicamentos"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="consumo_toxicos"
                label="Consumo de Tóxicos"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="exp_medios_pantallas"
                label="Exposición a medios de pantallas"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          </div>
        {/* Paso 2 */}
        <div style={{ display: current === 2 ? "block" : "none", width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="trastorno_neurodesarrollo"
                label="Trastornos del Neurodesarrollo"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="obesidad"
                label="Obesidad"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hipertension_arterial"
                label="Hipertensión Arterial"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="trastornos_aprendizaje"
                label="Trastornos del Aprendizaje"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="trastornos_comportamiento"
                label="Trastornos del Comportamiento"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="res_insulina"
                label="Resistencia a la insulina"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cefalea"
                label="Cefalea"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="depresion"
                label="Depresión"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          </div>
        {/* Paso 3 */}
        <div style={{ display: current === 3 ? "block" : "none", width: "100%" }}>
        <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="higienico_dietetico"
                label="Tratamiento Higiénico/Dietético"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cognitivo_conductual"
                label="Tratamiento Cognitivo/Conductual"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="medicamentoso"
                label="Tratamiento Medicamentoso"
                rules={[{ required: true, message: "Selecciona una opción" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          {current > 0 && (
            <Button
            type="default"
            onClick={prev}
            shape="circle"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              fontSize: 18,
            }}
          >
            <ArrowBackIosNewIcon style={{ margin: 0, fontSize: 20 }} />
          </Button>
          )}
          {current < steps.length - 1 && (
            <Button
            type="primary"
            onClick={next}
            shape="circle"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              fontSize: 18,
            }}
          >
            <ArrowForwardIosIcon style={{ margin: 0, fontSize: 20 }} />
          </Button>
          )}
          {current === steps.length - 1 && (
           <Button
              type="primary"
              htmlType="submit"
              shape="circle"
              loading={loading}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                fontSize: 18,
              }}
            >
              <HowToRegIcon style={{ margin: 0, fontSize: 20, color:"White" }} />
            </Button>
          )}
        </div>
      </Form>
    </>
  );
}
