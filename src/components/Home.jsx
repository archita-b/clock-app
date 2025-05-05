import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/stopwatch">Stopwatch</Link>
        <Link to="/timer">Timer</Link>
      </nav>
    </div>
  );
};

export default Home;
