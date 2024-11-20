import Layout from "../../Components/Layout";

function Home() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center items-start justify-center m-auto h-auto">
        <div className="w-full md:w-1/2">
          <img src="slep.jpg" alt="" className="w-full h-auto rounded-lg" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center m-auto mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">
            Trastorno del sueño en pacientes pediatricos
          </h1>
          <p className="text-xl mt-4">
            Esta aplicación utiliza un modelo de inteligencia artificial para
            predecir la probabilidad de trastornos del sueño en pacientes
            pediátricos, ayudando a mejorar el diagnóstico y tratamiento
            temprano.
          </p>
          <p className="text-xl mt-4">
            <strong>Creado por:</strong>
            <br />
            Dra. Grethel Camejo Sampedro <br />
            José Daniel Monzón Rodríguez
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
