import React from "react";
import "./timerInput.css";

const TimerInput = ({
  hours,
  setHours,
  minutes,
  setMinutes,
  seconds,
  setSeconds,
}) => {
  return (
    <div className="input-containers">
      <input
        value={hours}
        type="number"
        min="0"
        placeholder="HH"
        onChange={(e) => setHours(e.target.value.padStart(2, "0"))}
      />
      <span>:</span>
      <input
        value={minutes}
        type="number"
        min="0"
        max="59"
        placeholder="MM"
        onChange={(e) => setMinutes(e.target.value.padStart(2, "0"))}
      />
      <span>:</span>
      <input
        value={seconds}
        type="number"
        min="0"
        max="59"
        placeholder="SS"
        onChange={(e) => setSeconds(e.target.value.padStart(2, "0"))}
      />
    </div>
  );
};

export default TimerInput;
