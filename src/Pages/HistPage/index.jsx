import React from "react";
import ToastNotification from "../../Components/ToastNotification";
import Layout from "../../Components/Layout";
import Historial from "../../Components/Historial";


function HistPage() {
  return (
      <>
      <Layout>
      <Historial />
      <ToastNotification />
      </Layout>
      
      </>
  );
}

export default HistPage;
