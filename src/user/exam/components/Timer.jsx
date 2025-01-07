import React, { useEffect, useState } from "react";
import "./Timer.css";

const Timer = ({ durationMinutes, onTimeout, sectionTitle }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}M ${secs}s`;
  };

  return (
      <div className="timer-container">
        <div className="timer-header">
          <span className="timer-icon">⏱️</span>
          <span className="time-left">{formatTime(timeLeft)}</span>
          <span className="session-text">TIME LEFT IN THIS ASSIGNMENT SESSION</span>
        </div>
        <div className="section-title">
          <strong>Current Section:</strong> {sectionTitle}
        </div>
      </div>
  );
};

export default Timer;
