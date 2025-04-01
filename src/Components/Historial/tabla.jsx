import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Button } from "@mui/material";

const Tabla = ({ data, onEdit, onDelete }) => {
  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth:100 },
    { field: "sexo", headerName: "Sexo", flex: 1, minWidth:90, filterable: true },
    { field: "edad", headerName: "Edad", flex: 1, filterable: true },
    { field: "resultado", headerName: "Resultado", flex: 1, minWidth:90, filterable: true },
    { field: "ant_patologicos_fam", headerName: "APF", flex: 1, filterable: true },
    { field: "ant_pre_peri_postnatales_positivos", headerName: "APPPP", flex: 1, minWidth:70, filterable: true },
    { field: "alteraciones_anatomicas", headerName: "AA", flex: 1, filterable: true },
    { field: "consumo_medicamentos", headerName: "CM", flex: 1, filterable: true },
    { field: "consumo_toxicos", headerName: "CT", flex: 1, filterable: true },
    { field: "exp_medios_pantallas", headerName: "EMP", flex:1, filterable: true },
    { field: "trastorno_neurodesarrollo", headerName: "TND", flex: 1, filterable: true },
    { field: "obesidad", headerName: "OB", flex: 1, filterable: true },
    { field: "hipertension_arterial", headerName: "HH", flex: 1, filterable: true },
    { field: "trastornos_aprendizaje", headerName: "TA", flex: 1, filterable: true },
    { field: "trastornos_comportamiento", headerName: "TC", flex: 1, filterable: true },
    { field: "cefalea", headerName: "CE", flex: 1, filterable: true },
    { field: "res_insulina", headerName: "RI", flex: 1, filterable: true },
    { field: "depresion", headerName: "DEP", flex: 1, filterable: true },
    { field: "higienico_dietetico", headerName: "H-D", flex: 1, filterable: true },
    { field: "cognitivo_conductual", headerName: "C-C", flex: 1, filterable: true },
    { field: "medicamentoso", headerName: "MED", flex: 1, filterable: true },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 190,
      filterable: false,
      sortable:false,
      hiddable:false, 
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onEdit(params.row.id)}
            style={{ marginRight: 8 }}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => onDelete(params.row.id)}  
          >
            Eliminar
          </Button>
        </>
      ),
      
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[5, 10, 15, 20, 25,50, 100]}
        //checkboxSelection
      />
    </div>
  );
};

export default Tabla;
