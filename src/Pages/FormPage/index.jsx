import React from "react";
import Layout from "../../Components/Layout";
import EvalForm from "../../Components/EvalForm";
import ToastNotification from "../../Components/ToastNotification";


function FormPage() {
  return (
    <Layout>
      <EvalForm />
      <ToastNotification />
    </Layout>
  );
}

export default FormPage;
