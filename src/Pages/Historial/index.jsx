import React from "react";
import Layout from "../../Components/Layout";
import Historial from "../../Components/Historial";
import ErrorBoundary from "../../Components/ErrorBoundary";
import ToastNotification from "../../Components/ToastNotification";

function Hist_page() {
  return <ErrorBoundary>
         <ToastNotification />
          <Historial/>
         </ErrorBoundary>
  
  
 ;
}

export default Hist_page;
