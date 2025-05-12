import React from "react";

const TimerReset = ({ resetTimer }) => {
  return (
    <button className="reset-timer" onClick={resetTimer}>
      Reset
    </button>
  );
};

export default TimerReset;
