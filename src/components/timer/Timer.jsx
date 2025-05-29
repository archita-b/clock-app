import React, { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import TimerInput from "../timerInput/TimerInput";
import TimerStartButton from "../timerStartButton/TimerStartButton";
import TimerResetButton from "../timerResetButton/TimerResetButton";
import TimerDismissButton from "../timerDismissButton/TimerDismissButton";
import TimerRestartButton from "../timerRestartButton/TimerRestartButton";
import Popup from "../popup/Popup";
import notification from "../../assets/notification.mp3";
import { formatTime } from "../../utils/FormatTime";
import { useTimer } from "../../utils/useTimer";
import "./timer.css";

const Timer = ({ id, inputTimeInMilliseconds, deleteTimer }) => {
  const [showPopup, setShowPopup] = useState(false);

  const audioRef = useRef(null);

  function notifyMe() {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Time's up!");
    }
  }

  const { startTimer, toggleTimer, restartTimer, stateMachine, percentage } =
    useTimer({
      inputTimeInMilliseconds,
      onRestart: () => {
        setShowPopup(false);
        audioRef.current.pause();
      },
      onFinished: () => {
        setShowPopup(true);
        audioRef.current.play();
        notifyMe();
      },
      onReset: () => {
        setShowPopup(false);
        audioRef.current.pause();
      },
    });

  useEffect(() => {
    audioRef.current = new Audio(notification);
    audioRef.current.loop = true;
  }, []);

  function dismissPopup() {
    setShowPopup(false);
    audioRef.current.pause();
  }

  function getColor(percentage) {
    if (percentage > 50) return "#4caf50";
    if (percentage > 30) return "#ff9800";
    return "#f44336";
  }

  return (
    <>
      {showPopup && (
        <Popup dismissPopup={dismissPopup} restartTimer={restartTimer} />
      )}

      <div className="timer">
        <div className="progress-bar">
          {stateMachine.state !== "FINISHED" ? (
            <CircularProgressbar
              value={percentage}
              text={
                stateMachine.state === "IDLE"
                  ? formatTime(inputTimeInMilliseconds)
                  : formatTime(stateMachine.timeLeft)
              }
              styles={buildStyles({
                pathColor: getColor(percentage),
                textColor: "#333",
                trailColor: "#eee",
                strokeLinecap: "round",
                pathTransitionDuration: 0.5,
              })}
            />
          ) : (
            <div className="timer-display">
              {formatTime(stateMachine.timeLeft, false)}
            </div>
          )}
        </div>

        <div className="timer-control">
          {stateMachine.state === "IDLE" && (
            <TimerStartButton startTimer={startTimer} />
          )}

          {["RUNNING", "PAUSED", "FINISHED"].includes(stateMachine.state) && (
            <>
              {stateMachine.state === "FINISHED" ? (
                <TimerRestartButton restartTimer={restartTimer} />
              ) : (
                <button className="resume-timer" onClick={toggleTimer}>
                  {stateMachine.state === "RUNNING" ? "Pause" : "Resume"}
                </button>
              )}

              {showPopup ? (
                <TimerDismissButton dismissPopup={dismissPopup} />
              ) : (
                <button
                  className="delete-timer"
                  onClick={() => deleteTimer(id)}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;
