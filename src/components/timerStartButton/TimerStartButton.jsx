import React from "react";
import "./timerStartButton.css";

const TimerStartButton = ({ startTimer }) => {
  return (
    <button className="start-timer" onClick={startTimer}>
      Start
    </button>
  );
};

export default TimerStartButton;
