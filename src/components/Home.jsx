import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav>
        <Link to="/stopwatch">Stopwatch</Link>
        <Link to="/timer">Timer</Link>
      </nav>
    </div>
  );
};

export default Home;
