import React, { useEffect } from "react";
import '../../style/TimeUpModal.scss';

const TimeUpModal = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="timeup-overlay">
      <div className="timeup-container">
        <div className="timeup-content">
          <div className="timeup-clock">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 15" stroke="#6a11cb" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="9" stroke="#6a11cb" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="timeup-title">Time's Up!</h2>
          <p className="timeup-message">Your session has ended. Review your results below.</p>
          <button 
            className="timeup-actionbtn"
            onClick={onClose}
            aria-label="View results"
          >
            View Results
            <span className="timeup-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeUpModal;