import React from "react";
import Usuarios from "../../Components/Usuarios";
import ToastNotification from "../../Components/ToastNotification";
import Layout from "../../Components/Layout";


function UsersPage() {
  return (
      <>
      <Layout>
      <Usuarios />
      <ToastNotification />
      </Layout>
      </>
  );
}

export default UsersPage;
