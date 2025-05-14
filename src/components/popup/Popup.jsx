import React from "react";
import "./popup.css";
import TimerRestartButton from "../timerRestartButton/TimerRestartButton";
import TimerDismissButton from "../timerDismissButton/TimerDismissButton";

const Popup = ({ dismissPopup, restartTimer }) => {
  return (
    <div className="popup">
      <span>Time's up!</span>
      <div className="popup-control">
        <TimerRestartButton restartTimer={restartTimer} />
        <TimerDismissButton dismissPopup={dismissPopup} />
      </div>
    </div>
  );
};

export default Popup;
