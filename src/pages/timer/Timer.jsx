import React, { useState, useRef, useEffect } from "react";
import notification from "../../assets/notification.mp3";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./timer.css";

const Timer = () => {
  const initialTime = 10 * 1000;
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const [defaultTime, setDefaultTime] = useState(initialTime);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(intervalRef.current);
            setIsTimerRunning(false);
            setIsFinished(true);
            setTimeLeft(defaultTime);
            setShowPopup(true);
            audioRef.current.play();
            return defaultTime;
          }

          return prev - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning, defaultTime]);

  useEffect(() => {
    audioRef.current = new Audio(notification);
    audioRef.current.loop = true;
  }, []);

  function startTimer() {
    const totalMs =
      1000 *
      (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds));

    if (totalMs > 0) {
      setDefaultTime(totalMs);
      setTimeLeft(totalMs);
      setIsTimerRunning(true);
      setHasStarted(true);
    }
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    setIsTimerRunning(false);
    setHasStarted(false);
    setShowPopup(false);
    audioRef.current.pause();
    setTimeLeft(0);
    setHours("00");
    setMinutes("00");
    setSeconds("00");
  }

  function toggleTimer() {
    setIsTimerRunning((prevState) => !prevState);
  }

  function restartTimer() {
    setTimeLeft(defaultTime);
    setIsFinished(false);
    setIsTimerRunning(true);
    setShowPopup(false);
  }

  function dismissPopup() {
    setShowPopup(false);
    audioRef.current.pause();
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

  const percentage = timeLeft > 0 ? (timeLeft / defaultTime) * 100 : 0;

  function getColor(percentage) {
    if (percentage > 66) return "#4caf50";
    if (percentage > 33) return "#ff9800";
    return "#f44336";
  }

  const currentColor = getColor(percentage);

  return (
    <>
      {showPopup && (
        <div className="popup">
          <span>Time's up!</span>
          <button onClick={dismissPopup}>Dismiss</button>
        </div>
      )}
      <div className="timer">
        {!hasStarted ? (
          <div className="input-containers">
            <input
              value={hours}
              type="number"
              min="0"
              placeholder="HH"
              onChange={(e) => setHours(e.target.value.padStart(2, "0"))}
            />
            <span>:</span>
            <input
              value={minutes}
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              onChange={(e) => setMinutes(e.target.value.padStart(2, "0"))}
            />
            <span>:</span>
            <input
              value={seconds}
              type="number"
              min="0"
              max="59"
              placeholder="SS"
              onChange={(e) => setSeconds(e.target.value.padStart(2, "0"))}
            />
          </div>
        ) : (
          <div className="progress-bar">
            {!isFinished ? (
              <CircularProgressbar
                value={percentage}
                text={formatTime(timeLeft)}
                styles={buildStyles({
                  pathColor: currentColor,
                  textColor: "#333",
                  trailColor: "#eee",
                  strokeLinecap: "round",
                  pathTransitionDuration: 0.5,
                })}
              />
            ) : (
              <div className="timer-display">{formatTime(timeLeft)}</div>
            )}
          </div>
        )}

        <div className="timer-control">
          {!hasStarted && (
            <button className="start-timer" onClick={startTimer}>
              Start
            </button>
          )}
          {hasStarted && (
            <>
              <button
                className="resume-timer"
                onClick={isFinished ? restartTimer : toggleTimer}
              >
                {isFinished ? "Restart" : isTimerRunning ? "Pause" : "Resume"}
              </button>
              <button className="delete-timer" onClick={resetTimer}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;
