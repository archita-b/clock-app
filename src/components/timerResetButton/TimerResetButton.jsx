import React from "react";

const TimerResetButton = ({ resetTimer }) => {
  return (
    <button className="reset-timer" onClick={resetTimer}>
      Reset
    </button>
  );
};

export default TimerResetButton;
