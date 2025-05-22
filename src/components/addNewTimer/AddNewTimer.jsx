import React from "react";
import { IoAdd } from "react-icons/io5";
import "./addNewTimer.css";

const AddNewTimer = () => {
  return (
    <div className="add-timer-button">
      <button>
        <IoAdd />
      </button>
    </div>
  );
};

export default AddNewTimer;
