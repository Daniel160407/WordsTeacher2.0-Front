import { useState, useRef, useEffect } from "react";

const Timer = ({ timerTime, setTimerTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timerTime);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRunning) return;
    setTimeLeft(timerTime);
    setTimerRunning(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimeLeft(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="timer">
      <input
        type="number"
        value={timerTime}
        onChange={(e) => {
          const value = e.target.value;
          setTimerTime(value === "" ? "" : Number(value));
        }}
      />
      <div className="timerControlButtons">
        <button className="btn-gold" onClick={startTimer}>
          Start
        </button>
        <button className="btn-danger" onClick={stopTimer}>
          Stop
        </button>
      </div>
      <h3 id="time">{timeLeft}</h3>
    </div>
  );
};

export default Timer;