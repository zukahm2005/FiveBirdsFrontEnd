import React, { useState, useEffect } from 'react';

const Timer = ({ timeLimit, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

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
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Thời gian còn lại: {formatTime(timeLeft)}</div>;
};

export default Timer;
