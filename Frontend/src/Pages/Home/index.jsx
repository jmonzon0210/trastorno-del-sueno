import Layout from "../../Components/Layout";
import Logo from "../../../assets/sleep.png";

function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center max-w-4xl w-full">
    <div className="w-full md:w-1/2">
      <img src= {Logo} alt="Sleep" className="w-full h-auto rounded-lg" />
    </div>
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center mt-6 md:mt-0 md:ml-6">
      <h1 className="text-3xl font-bold">
        Sistema Inteligente para la Detección de Trastornos del sueño en Pacientes Pediátricos
      </h1>
      <p className="text-xl mt-4">
        Esta aplicación utiliza un modelo de inteligencia artificial para
        predecir la probabilidad de trastornos del sueño en pacientes
        pediátricos, ayudando a mejorar el diagnóstico y tratamiento temprano.
      </p>
      <p className="text-xl mt-4">
        <strong>Creado por:</strong><br />
        José Daniel Monzón Rodríguez
      </p>
    </div>
  </div>
</div>


    </Layout>
  );
}

export default Home;
