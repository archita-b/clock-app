import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

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

  function goToPrevious() {
    setTimerIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  }

  function goToNext() {
    setTimerIndex((prevIndex) =>
      prevIndex < timers.length - 1 ? prevIndex + 1 : prevIndex
    );
  }

  return (
    <div className="timer-page">
      {showInput ? (
        <div className="input-section">
          <TimerInput inputTime={inputTime} setInputTime={setInputTime} />
          <button className="add-timer" onClick={addTimer}>
            Add Timer
          </button>
        </div>
      ) : (
        <div onClick={() => setShowInput(true)}>
          <AddNewTimer />
        </div>
      )}

      {!showInput && (
        <div className="timer-navigation">
          {timers.length > 1 && (
            <button
              className="nav-arrow"
              onClick={goToPrevious}
              disabled={timerIndex === 0}
            >
              <IoIosArrowBack />
            </button>
          )}

          <div className="timers-list">
            {timers.map((timer, index) => (
              <div
                key={timer.id}
                className={`timer-wrapper ${
                  index === timerIndex ? "active" : "hidden"
                }`}
              >
                <Timer
                  id={timer.id}
                  inputTimeInMilliseconds={timer.inputTimeInMilliseconds}
                  deleteTimer={deleteTimer}
                />
              </div>
            ))}
          </div>

          {timers.length > 1 && (
            <button
              className="nav-arrow"
              onClick={goToNext}
              disabled={timerIndex === timers.length - 1}
            >
              <IoIosArrowForward />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TimerPage;
