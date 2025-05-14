import React from "react";
import "./timerDismissButton.css";

const TimerDismissButton = ({ dismissPopup }) => {
  return (
    <button className="dismiss-timer" onClick={dismissPopup}>
      Dismiss
    </button>
  );
};

export default TimerDismissButton;
