import React from "react";

const TimerStart = ({ startTimer }) => {
  return (
    <button className="start-timer" onClick={startTimer}>
      Start
    </button>
  );
};

export default TimerStart;
