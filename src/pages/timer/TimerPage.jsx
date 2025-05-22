import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import TimerInput from "../../components/timerInput/TimerInput";
import AddNewTimer from "../../components/addNewTimer/AddNewTimer";
import Timer from "./Timer";
import "./timerPage.css";

const TimerPage = () => {
  const [timers, setTimers] = useState([]);
  const [inputTime, setInputTime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [showInput, setShowInput] = useState(true);

  const inputTimeInMilliseconds =
    1000 *
    (parseInt(inputTime.hours || "0") * 3600 +
      parseInt(inputTime.minutes || "0") * 60 +
      parseInt(inputTime.seconds || "0"));

  function addTimer() {
    const totalMs = inputTimeInMilliseconds;

    if (totalMs <= 0) return;

    const id = uuidv4();

    setTimers((prevTimers) => [
      ...prevTimers,
      { id, inputTimeInMilliseconds: totalMs },
    ]);
    setInputTime({ hours: "", minutes: "", seconds: "" });
    setShowInput(false);
  }

  function deleteTimer(id) {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  }

  return (
    <div className="timer-page">
      {showInput && (
        <div className="input-section">
          <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
          <button className="add-timer" onClick={addTimer}>
            Add Timer
          </button>
        </div>
      )}

      {!showInput && (
        <>
          <div onClick={() => setShowInput(true)}>
            <AddNewTimer />
          </div>

          <div className="timers-list">
            {timers.map((timer) => (
              <Timer
                key={timer.id}
                id={timer.id}
                inputTimeInMilliseconds={timer.inputTimeInMilliseconds}
                deleteTimer={deleteTimer}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TimerPage;
