import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Stopwatch from "./pages/stopwatch/StopWatch";
import TimerPage from "./pages/timer/TimerPage";
import "./App.css";

function App() {
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/stopwatch" />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/timer" element={<TimerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
