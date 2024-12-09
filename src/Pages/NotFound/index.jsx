import React from "react";
import Layout from "../../Components/Layout";

function NotFound() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-2">No se encontró la página</p>
        <p className="text-sm text-gray-500">
          La página que estás buscando no existe o ha sido movida.
        </p>
      </div>
    </Layout>
  );
}

export default NotFound;
