import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/Navbar";
import Stopwatch from "./pages/stopwatch/StopWatch";
import Timer from "./pages/timer/Timer";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
