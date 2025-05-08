import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Stopwatch
      </NavLink>
      <NavLink
        to="/timer"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Timer
      </NavLink>
    </nav>
  );
};

export default Navbar;
