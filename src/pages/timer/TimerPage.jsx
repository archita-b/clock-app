import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import TimerInput from "../../components/timerInput/TimerInput";
import AddNewTimer from "../../components/addNewTimer/AddNewTimer";
import Timer from "../../components/timer/Timer";
import Modal from "../../components/modal/Modal";

import "./timerPage.css";

const TimerPage = () => {
  const [timers, setTimers] = useState([]);
  const [inputTime, setInputTime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [showInput, setShowInput] = useState(true);
  const [timerIndex, setTimerIndex] = useState(0);

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
    setTimerIndex(timers.length);
  }

  function deleteTimer(id) {
    setTimers((prevTimers) => {
      const remainingTimers = prevTimers.filter((timer) => timer.id !== id);
      const newTimerIndex = Math.min(timerIndex, remainingTimers.length - 1);
      setTimerIndex(newTimerIndex >= 0 ? newTimerIndex : 0);
      return remainingTimers;
    });
  }

  return (
    <div className="timer-page">
      {timers.length === 0 && showInput && (
        <div className="input-section">
          <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
          <button className="add-timer" onClick={addTimer}>
            Add Timer
          </button>
        </div>
      )}

      {timers.length >= 0 && !showInput && (
        <div onClick={() => setShowInput(true)}>
          <AddNewTimer />
        </div>
      )}

      {timers.length > 0 && showInput && (
        <Modal onClose={() => setShowInput(false)}>
          <div className="input-section">
            <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
            <button className="add-timer" onClick={addTimer}>
              Add Timer
            </button>
          </div>
        </Modal>
      )}

      {timers.length > 0 && (
        <div className="slider">
          <div className="slides">
            {timers.map((timer) => (
              <div key={timer.id} className="slide">
                <Timer
                  id={timer.id}
                  inputTimeInMilliseconds={timer.inputTimeInMilliseconds}
                  deleteTimer={deleteTimer}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerPage;
