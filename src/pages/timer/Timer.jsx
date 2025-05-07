import React, { useState, useRef, useEffect } from "react";
import "./timer.css";

const Timer = () => {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(intervalRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning]);

  function startTimer() {
    const totalMs =
      1000 *
      (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds));

    if (totalMs > 0) {
      setTimeLeft(totalMs);
      setIsTimerRunning(true);
      setHasStarted(true);
    }
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    setIsTimerRunning(false);
    setHasStarted(false);
    setTimeLeft(0);
    setHours("00");
    setMinutes("00");
    setSeconds("00");
  }

  function toggleTimer() {
    setIsTimerRunning((prevState) => !prevState);
  }

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = Math.floor(totalSeconds % 60);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="timer">
      {!hasStarted ? (
        <div className="input-containers">
          <input
            value={hours}
            type="number"
            min="0"
            placeholder="HH"
            onChange={(e) => setHours(e.target.value)}
          />
          <span>:</span>
          <input
            value={minutes}
            type="number"
            min="0"
            max="59"
            placeholder="MM"
            onChange={(e) => setMinutes(e.target.value)}
          />
          <span>:</span>
          <input
            value={seconds}
            type="number"
            min="0"
            max="59"
            placeholder="SS"
            onChange={(e) => setSeconds(e.target.value)}
          />
        </div>
      ) : (
        <div className="timer-display">{formatTime(timeLeft)}</div>
      )}

      <div className="timer-control">
        {!hasStarted && (
          <button className="start-timer" onClick={startTimer}>
            Start
          </button>
        )}
        {hasStarted && (
          <>
            <button className="resume-timer" onClick={toggleTimer}>
              {isTimerRunning ? "Pause" : "Resume"}
            </button>
            <button className="delete-timer" onClick={resetTimer}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
