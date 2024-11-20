import * as Yup from "yup";

const formSchema = Yup.object().shape({
  edad: Yup.number()
    .min(0, "El valor mínimo es 0")
    .max(18, "El valor máximo es 18")
    .required("Requerido"),
});

export default formSchema;
