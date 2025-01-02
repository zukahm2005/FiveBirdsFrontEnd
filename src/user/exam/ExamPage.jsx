import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import QuestionCard from "./components/QuestionCard";
import Timer from "./components/Timer";
import questions from "./questions.json";
import { useNavigate } from "react-router-dom"; // Điều hướng trang
import Cookies from "js-cookie"; // Thư viện để xử lý cookie

const ExamPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate(); // Hook để điều hướng

  // Hàm đăng xuất
  const handleLogout = () => {
    Cookies.remove("authToken"); // Xóa token trong cookie
    alert("Bạn đã hoàn thành bài thi và sẽ được đăng xuất."); // Thông báo hoàn thành
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      handleLogout(); // Gọi hàm đăng xuất sau khi hoàn thành bài thi
    }
  };

  const handleTimeout = () => {
    alert("Hết thời gian làm bài!");
    handleLogout(); // Đăng xuất khi hết giờ
  };

  if (!isStarted) {
    return (
        <div className="exam-page">
          <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col xs={24} sm={18} md={12} lg={10}>
              <Button type="primary" onClick={handleStart}>
                Bắt đầu làm bài
              </Button>
            </Col>
          </Row>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
      <div className="exam-page">
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={18} md={12} lg={10}>
            <Timer duration={30 * 60} onTimeout={handleTimeout} />
            <QuestionCard
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                onNext={handleNextQuestion}
            />
          </Col>
        </Row>
      </div>
  );
};

export default ExamPage;
