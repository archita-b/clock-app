import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import StopWatch from "./components/StopWatch";
import Timer from "./components/Timer";

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
