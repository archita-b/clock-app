import React, { useEffect, useRef, useReducer } from "react";

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

export function useTimer({
  inputTimeInMilliseconds,
  onRestart,
  onFinished,
  onReset,
}) {
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
