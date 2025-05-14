import React, { useState, useEffect, useRef, useReducer } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import notification from "../../assets/notification.mp3";
import Popup from "../../components/popup/Popup";
import TimerInput from "../../components/timerInput/TimerInput";
import TimerStart from "../../components/timerStart/TimerStart";
import TimerReset from "../../components/timerReset/TimerReset";
import { formatTime } from "../../utils/FormatTime";
import "./timer.css";

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
      return {
        ...state,
        timeLeft: state.timeLeft - 1000,
      };

    case "PAUSE-RESUME":
      return { ...state, isTimerRunning: !state.isTimerRunning };

    case "FINISH":
      return {
        ...state,
        timeLeft: action.payload.lastInput,
        isTimerRunning: false,
        isFinished: true,
      };

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

const initialState = {
  timeLeft: 0,
  isTimerRunning: false,
  hasStarted: false,
  isFinished: false,
};

const Timer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [inputTime, setInputTime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  const initialTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

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
    if (state.timeLeft <= 0 && state.isTimerRunning) {
      clearInterval(intervalRef.current);
      dispatch({
        type: "FINISH",
        payload: { lastInput: inputTimeInMilliseconds },
      });
      setShowPopup(true);
      audioRef.current.play();
    }
  }, [state.timeLeft, state.isTimerRunning]);

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
    dispatch({ type: "RESTART", payload: { time: initialTimeRef.current } });
    setShowPopup(false);
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
      {showPopup && <Popup dismissPopup={dismissPopup} />}

      <div className="timer">
        {!state.hasStarted ? (
          <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
        ) : (
          <div className="progress-bar">
            {!state.isFinished ? (
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
            ) : (
              <div className="timer-display">
                {formatTime(state.timeLeft, false)}
              </div>
            )}
          </div>
        )}

        <div className="timer-control">
          {!state.hasStarted && <TimerStart startTimer={startTimer} />}

          {state.hasStarted && (
            <>
              <button
                className="resume-timer"
                onClick={state.isFinished ? restartTimer : toggleTimer}
                disabled={state.isFinished && showPopup}
              >
                {state.isFinished
                  ? "Restart"
                  : state.isTimerRunning
                  ? "Pause"
                  : "Resume"}
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
