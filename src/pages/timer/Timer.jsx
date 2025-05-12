import React, { useState, useRef, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import notification from "../../assets/notification.mp3";
import Popup from "../../components/popup/Popup";
import TimerInput from "../../components/timerInput/TimerInput";
import TimerStart from "../../components/timerStart/TimerStart";
import TimerReset from "../../components/timerReset/TimerReset";
import { formatTime } from "../../utils/FormatTime";
import "./timer.css";

const milliSecondsInSeconds = 1000;
const defaultTime = 10 * milliSecondsInSeconds;

const Timer = () => {
  const [inputTime, setInputTime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [initialTime, setInitialTime] = useState(defaultTime);
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
            setTimeLeft(initialTime);
            setShowPopup(true);
            audioRef.current.play();
            return initialTime;
          }

          return prev - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning, initialTime]);

  useEffect(() => {
    audioRef.current = new Audio(notification);
    audioRef.current.loop = true;
  }, []);

  function startTimer() {
    const totalMs =
      1000 *
      (parseInt(inputTime.hours || "0") * 3600 +
        parseInt(inputTime.minutes || "0") * 60 +
        parseInt(inputTime.seconds || "0"));

    if (totalMs > 0) {
      setInitialTime(totalMs);
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
    setInputTime({ hours: "", minutes: "", seconds: "" });
  }

  function toggleTimer() {
    setIsTimerRunning((prevState) => !prevState);
  }

  function restartTimer() {
    setTimeLeft(initialTime);
    setIsFinished(false);
    setIsTimerRunning(true);
    setShowPopup(false);
  }

  function dismissPopup() {
    setShowPopup(false);
    audioRef.current.pause();
  }

  const percentage = timeLeft > 0 ? (timeLeft / initialTime) * 100 : 0;

  function getColor(percentage) {
    if (percentage > 50) return "#4caf50";
    if (percentage > 30) return "#ff9800";
    return "#f44336";
  }

  return (
    <>
      {showPopup && <Popup dismissPopup={dismissPopup} />}

      <div className="timer">
        {!hasStarted ? (
          <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
        ) : (
          <div className="progress-bar">
            {!isFinished ? (
              <CircularProgressbar
                value={percentage}
                text={formatTime(timeLeft)}
                styles={buildStyles({
                  pathColor: getColor(percentage),
                  textColor: "#333",
                  trailColor: "#eee",
                  strokeLinecap: "round",
                  pathTransitionDuration: 0.5,
                })}
              />
            ) : (
              <div className="timer-display">{formatTime(timeLeft, false)}</div>
            )}
          </div>
        )}

        <div className="timer-control">
          {!hasStarted && <TimerStart startTimer={startTimer} />}

          {hasStarted && (
            <>
              <button
                className="resume-timer"
                onClick={isFinished ? restartTimer : toggleTimer}
                disabled={isFinished && showPopup}
              >
                {isFinished ? "Restart" : isTimerRunning ? "Pause" : "Resume"}
              </button>
              <TimerReset resetTimer={resetTimer} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;
