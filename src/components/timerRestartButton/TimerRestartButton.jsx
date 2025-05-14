import React from "react";
import "./timerRestartButton.css";

const TimerRestartButton = ({ restartTimer }) => {
  return (
    <button className="timer-restart" onClick={restartTimer}>
      Restart
    </button>
  );
};

export default TimerRestartButton;
