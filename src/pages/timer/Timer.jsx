import React, { useState, useEffect, useRef, useReducer } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import TimerInput from "../../components/timerInput/TimerInput";
import TimerStartButton from "../../components/timerStartButton/TimerStartButton";
import TimerResetButton from "../../components/timerResetButton/TimerResetButton";
import TimerDismissButton from "../../components/timerDismissButton/TimerDismissButton";
import TimerRestartButton from "../../components/timerRestartButton/TimerRestartButton";
import Popup from "../../components/popup/Popup";
import notification from "../../assets/notification.mp3";
import { formatTime } from "../../utils/FormatTime";
import "./timer.css";

const initialState = {
  state: "IDLE",
  timeLeft: 0,
};

function reducer(state, action) {
  switch (state.state) {
    case "IDLE":
      if (action.type === "START") {
        return {
          state: "RUNNING",
          timeLeft: action.payload.time,
        };
      }
      break;

    case "RUNNING":
      if (action.type === "TICK") {
        if (state.timeLeft <= 1000) {
          return {
            state: "FINISHED",
            timeLeft: action.payload.lastInput,
          };
        }
        return {
          ...state,
          timeLeft: state.timeLeft - 1000,
        };
      }
      if (action.type === "PAUSED") {
        return {
          ...state,
          state: "PAUSED",
        };
      }
      if (action.type === "RESET") {
        return initialState;
      }
      break;

    case "PAUSED":
      if (action.type === "RESUME") {
        return {
          ...state,
          state: "RUNNING",
        };
      }
      if (action.type === "RESET") {
        return initialState;
      }
      break;

    case "FINISHED":
      if (action.type === "RESTART") {
        return {
          state: "RUNNING",
          timeLeft: action.payload.time,
        };
      }
      if (action.type === "RESET") {
        return initialState;
      }
      break;

    default:
      return state;
  }
}

function useTimer({ inputTimeInMilliseconds, onRestart, onFinished, onReset }) {
  const initialTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const [stateMachine, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (stateMachine.state === "RUNNING") {
      intervalRef.current = setInterval(() => {
        dispatch({
          type: "TICK",
          payload: { lastInput: inputTimeInMilliseconds },
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [stateMachine.state]);

  useEffect(() => {
    if (stateMachine.state === "FINISHED") {
      onFinished();
    }
  }, [stateMachine.state]);

  function startTimer() {
    if (inputTimeInMilliseconds > 0) {
      initialTimeRef.current = inputTimeInMilliseconds;
      dispatch({ type: "START", payload: { time: inputTimeInMilliseconds } });
    }
  }

  function toggleTimer() {
    if (stateMachine.state === "PAUSED") {
      dispatch({ type: "RESUME" });
    } else if (stateMachine.state === "RUNNING") {
      dispatch({ type: "PAUSED" });
    }
  }

  function restartTimer() {
    onRestart();
    dispatch({ type: "RESTART", payload: { time: initialTimeRef.current } });
  }

  function resetTimer() {
    onReset();
    clearInterval(intervalRef.current);
    dispatch({ type: "RESET" });
  }

  const percentage =
    stateMachine.timeLeft > 0
      ? (stateMachine.timeLeft / initialTimeRef.current) * 100
      : 0;

  return {
    startTimer,
    toggleTimer,
    resetTimer,
    restartTimer,
    stateMachine,
    percentage,
  };
}

const Timer = () => {
  const [inputTime, setInputTime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  const audioRef = useRef(null);

  const inputTimeInMilliseconds =
    1000 *
    (parseInt(inputTime.hours || "0") * 3600 +
      parseInt(inputTime.minutes || "0") * 60 +
      parseInt(inputTime.seconds || "0"));

  const {
    startTimer,
    toggleTimer,
    resetTimer,
    restartTimer,
    stateMachine,
    percentage,
  } = useTimer({
    inputTimeInMilliseconds,
    setShowPopup,
    audioRef,
    onRestart: () => {
      setShowPopup(false);
      audioRef.current.pause();
    },
    onFinished: () => {
      setShowPopup(true);
      audioRef.current.play();
    },
    onReset: () => {
      setInputTime({ hours: "", minutes: "", seconds: "" });
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
        {stateMachine.state === "IDLE" ? (
          <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
        ) : (
          <div className="progress-bar">
            {stateMachine.state !== "FINISHED" ? (
              <CircularProgressbar
                value={percentage}
                text={formatTime(stateMachine.timeLeft)}
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
        )}

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
