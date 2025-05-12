import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../../utils/FormatTime";
import "./stopwatch.css";

const StopWatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function stop() {
    setIsRunning(false);
  }

  function reset() {
    setElapsedTime(0);
    setIsRunning(false);
  }

  return (
    <div className="stopwatch">
      <div className="stopwatch-display">{formatTime(elapsedTime, true)}</div>
      <div className="stopwatch-control-buttons">
        <button className="stopwatch-start-button" onClick={start}>
          Start
        </button>
        <button className="stopwatch-stop-button" onClick={stop}>
          Stop
        </button>
        <button className="stopwatch-reset-button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default StopWatch;
