import React from "react";
import Graficos from "../../Components/Graficos";
import ToastNotification from "../../Components/ToastNotification";
import Layout from "../../Components/Layout";


function GraphsPage() {
  return (
      <>
      <Layout>
      <Graficos />
      <ToastNotification />
      </Layout>
      
      </>
  );
}

export default GraphsPage;
