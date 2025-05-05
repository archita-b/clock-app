import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import StopWatch from "./pages/stopwatch/StopWatch";
import Timer from "./pages/timer/Timer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stopwatch" element={<StopWatch />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
