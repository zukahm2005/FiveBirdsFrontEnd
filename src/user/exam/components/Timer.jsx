import { Progress } from "antd";
import React, { useEffect, useState } from "react";
import "./Timer.css";

const Timer = ({ durationMinutes, onTimeout, onTimeUpdate,  sectionTitle, totalQuestions, isSubmitted, completedQuestions }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        const updatedTime = prev - 1;
        onTimeUpdate(updatedTime);
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout, onTimeUpdate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const progressPercentage = (completedQuestions / totalQuestions) * 100; // Tính phần trăm tiến trình

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
          <span className="session-text">
            <p>TIME LEFT IN THIS ASSIGNMENT SESSION</p>
          </span>
        </div>
      </div>
      <div>
        <Progress 
          percent={progressPercentage} // Hiển thị phần trăm dựa trên số câu hỏi hoàn thành
          status="active"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
          showInfo={false} // Ẩn thông tin phần trăm
        />
        <p>{completedQuestions}/{totalQuestions} Questions attempted</p>
      </div>
    </div>
  );
};

export default Timer;
