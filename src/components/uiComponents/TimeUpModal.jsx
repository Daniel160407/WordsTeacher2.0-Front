import React from "react";
import '../../style/TimeUpModal.scss';

const TimeUpModal = ({ onClose }) => {
  return (
    <div className="time-up-modal-overlay">
      <div className="time-up-modal">
        <div className="modal-content">
          <h2>Time's Up! ⏰</h2>
          <p>Great effort! Let's see how you did.</p>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeUpModal;