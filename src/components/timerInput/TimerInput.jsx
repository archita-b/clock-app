import React from "react";
import "./timerInput.css";

const TimerInput = ({ inputTime, setInputTime }) => {
  return (
    <div className="input-containers">
      <input
        value={inputTime.hours}
        type="number"
        min="0"
        placeholder="HH"
        onChange={(e) =>
          setInputTime({ ...inputTime, hours: e.target.value.padStart(2, "0") })
        }
      />
      <span>:</span>
      <input
        value={inputTime.minutes}
        type="number"
        min="0"
        max="59"
        placeholder="MM"
        onChange={(e) =>
          setInputTime({
            ...inputTime,
            minutes: e.target.value.padStart(2, "0"),
          })
        }
      />
      <span>:</span>
      <input
        value={inputTime.seconds}
        type="number"
        min="0"
        max="59"
        placeholder="SS"
        onChange={(e) =>
          setInputTime({
            ...inputTime,
            seconds: e.target.value.padStart(2, "0"),
          })
        }
      />
    </div>
  );
};

export default TimerInput;
