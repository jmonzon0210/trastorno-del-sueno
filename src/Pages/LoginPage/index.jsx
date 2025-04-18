import React from "react";
import Login from "../../Components/Login";
import ToastNotification from "../../Components/ToastNotification";
import Layout from "../../Components/Layout";


function LoginPage() {
  return (
      <>
      <Layout>
      <Login />
      <ToastNotification />
      </Layout>
      
      </>
  );
}

export default LoginPage;
