import React from "react";
import "./popup.css";

const Popup = ({ dismissPopup }) => {
  return (
    <div className="popup">
      <span>Time's up!</span>
      <button onClick={dismissPopup}>Dismiss</button>
    </div>
  );
};

export default Popup;
