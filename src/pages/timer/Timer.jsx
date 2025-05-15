import React, { useState, useEffect, useRef, useReducer } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import TimerInput from "../../components/timerInput/TimerInput";
import TimerStartButton from "../../components/timerStartButton/TimerStartButton";
import TimerResetButton from "../../components/timerResetButton/TimerResetButton";
import TimerDismissButton from "../../components/timerDismissButton/TimerDismissButton";
import TimerRestartButton from "../../components/timerRestartButton/TimerRestartButton";
import Popup from "../../components/popup/Popup";
import AddNewTimer from "../../components/addNewTimer/AddNewTimer";
import notification from "../../assets/notification.mp3";
import { formatTime } from "../../utils/FormatTime";
import "./timer.css";

const initialState = {
  timeLeft: 0,
  isTimerRunning: false,
  hasStarted: false,
  isFinished: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "START":
      return {
        ...state,
        timeLeft: action.payload.time,
        isTimerRunning: true,
        hasStarted: true,
        isFinished: false,
      };

    case "TICK":
      if (state.timeLeft - 1000 <= 0) {
        return {
          ...state,
          timeLeft: 0,
          isTimerRunning: false,
          isFinished: true,
        };
      }
      if (state.timeLeft > 0 && state.isTimerRunning) {
        return {
          ...state,
          timeLeft: state.timeLeft - 1000,
        };
      }
      break;

    case "PAUSE-RESUME":
      return { ...state, isTimerRunning: !state.isTimerRunning };

    case "RESTART":
      return {
        ...state,
        timeLeft: action.payload.time,
        isTimerRunning: true,
        isFinished: false,
      };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

const Timer = () => {
  const [inputTime, setInputTime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  const initialTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const inputTimeInMilliseconds =
    1000 *
    (parseInt(inputTime.hours || "0") * 3600 +
      parseInt(inputTime.minutes || "0") * 60 +
      parseInt(inputTime.seconds || "0"));

  useEffect(() => {
    if (state.isTimerRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [state.isTimerRunning]);

  useEffect(() => {
    if (state.isFinished) {
      setShowPopup(true);
      audioRef.current?.play();
    }
  }, [state.isFinished]);

  useEffect(() => {
    audioRef.current = new Audio(notification);
    audioRef.current.loop = true;
  }, []);

  function startTimer() {
    if (inputTimeInMilliseconds > 0) {
      initialTimeRef.current = inputTimeInMilliseconds;
      dispatch({ type: "START", payload: { time: inputTimeInMilliseconds } });
    }
  }

  function toggleTimer() {
    dispatch({ type: "PAUSE-RESUME" });
  }

  function restartTimer() {
    setShowPopup(false);
    audioRef.current.pause();
    dispatch({ type: "RESTART", payload: { time: initialTimeRef.current } });
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    audioRef.current.pause();
    dispatch({ type: "RESET" });
    setInputTime({ hours: "", minutes: "", seconds: "" });
    setShowPopup(false);
  }

  function dismissPopup() {
    setShowPopup(false);
    audioRef.current.pause();
  }

  const percentage =
    state.timeLeft > 0 ? (state.timeLeft / initialTimeRef.current) * 100 : 0;

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
        {!state.hasStarted ? (
          <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
        ) : (
          <div className="progress-bar">
            {!state.isFinished ? (
              <>
                <AddNewTimer />
                <CircularProgressbar
                  value={percentage}
                  text={formatTime(state.timeLeft)}
                  styles={buildStyles({
                    pathColor: getColor(percentage),
                    textColor: "#333",
                    trailColor: "#eee",
                    strokeLinecap: "round",
                    pathTransitionDuration: 0.5,
                  })}
                />
              </>
            ) : (
              <div className="timer-display">
                {formatTime(state.timeLeft, false)}
              </div>
            )}
          </div>
        )}

        <div className="timer-control">
          {!state.hasStarted && <TimerStartButton startTimer={startTimer} />}

          {state.hasStarted && (
            <>
              {state.isFinished ? (
                <TimerRestartButton restartTimer={restartTimer} />
              ) : (
                <button className="resume-timer" onClick={toggleTimer}>
                  {state.isTimerRunning ? "Pause" : "Resume"}
                </button>
              )}

              {showPopup ? (
                <TimerDismissButton dismissPopup={dismissPopup} />
              ) : (
                <TimerResetButton resetTimer={resetTimer} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;
