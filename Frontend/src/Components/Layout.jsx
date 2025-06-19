import Navbar from "./Navbar";
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow bg-gray-100">
      {children}
    </main >
    </div>
  );
};

export default Layout;
