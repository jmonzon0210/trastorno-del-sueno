import React from "react";
import EvalForm from "../../Components/EvalForm";
import ToastNotification from "../../Components/ToastNotification";
import Layout from "../../Components/Layout";


function FormPage() {
  return (
      <>
      <Layout>
      <EvalForm />
      <ToastNotification />
      </Layout>
      
      </>
  );
}

export default FormPage;
