import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Stopwatch from "./pages/stopwatch/StopWatch";
import TimerPage from "./pages/timer/TimerPage";

function App() {
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
