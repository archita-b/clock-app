import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Navbar.css";
console.log(useLocation);

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink
        to="/stopwatch"
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
