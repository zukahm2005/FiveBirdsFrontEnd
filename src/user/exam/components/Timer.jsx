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
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="timer-container">
      <div className="section-title">
        <strong>{sectionTitle}</strong>
      </div>
      <div className="timer-header">
        <div>
          <span className="timer-icon">⏱️</span>
          <span className="time-left">{formatTime(timeLeft)}</span>
        </div>
        <div>
          <span className="session-text"><p>TIME LEFT IN THIS ASSIGNMENT SESSION</p></span>
        </div>
      </div>
      <div>
        <p>Progress</p>
      </div>

    </div>
  );
};

export default Timer;
