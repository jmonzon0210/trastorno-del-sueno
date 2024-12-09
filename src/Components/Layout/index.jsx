import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-16 p-8 rounded-lg shadow-md w-full max-w-3xl">
        {children}
      </div>
    </div>
  );
};

export default Layout;
