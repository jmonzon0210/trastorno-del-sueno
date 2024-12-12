import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const activeStyle = "underline underline-offset-4 text-blue-600 font-semibold";

  return (
    <nav className="flex justify-center items-center fixed top-0 z-10 w-full py-4 px-6 bg-white shadow-lg hover:scale-105">
      <ul className="flex items-center gap-8">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeStyle : "text-gray-700 hover:text-blue-500 transition duration-200"
            }
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/form"
            className={({ isActive }) =>
              isActive ? activeStyle : "text-gray-700 hover:text-blue-500 transition duration-200"
            }
          >
            Evaluar Paciente
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;