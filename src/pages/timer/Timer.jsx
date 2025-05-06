import React, { useState, useRef, useEffect } from "react";

const Timer = () => {
  const initialTime = 5 * 60 * 1000;

  const [timeLeft, setTimeLeft] = useState(initialTime);
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
    setIsTimerRunning(true);
    setHasStarted(true);
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    setIsTimerRunning(false);
    setHasStarted(false);
    setTimeLeft(initialTime);
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
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-control">
        {!hasStarted && (
          <div className="start-timer" onClick={startTimer}>
            Start
          </div>
        )}
        {hasStarted && (
          <>
            <div className="resume-button" onClick={toggleTimer}>
              {isTimerRunning ? "Pause" : "Resume"}
            </div>
            <div className="delete-timer" onClick={resetTimer}>
              Delete
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
