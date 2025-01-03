import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import QuestionCard from "./components/QuestionCard";
import Timer from "./components/Timer";
import { useNavigate } from "react-router-dom";
import { apiService } from "./service/apiService";

const ExamPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [duration, setDuration] = useState(30); // Giá trị mặc định là 30 phút
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Bạn đã hoàn thành bài thi.");
    navigate("/login");
  };

  const handleStart = async () => {
    try {
      setLoading(true);

      const roleData = await apiService.checkRole();
      const userId = roleData.userId;

      if (!userId) {
        alert("Không tìm thấy userId. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      const userExams = await apiService.getUserExams(userId);
      const examId = userExams?.data[0]?.exam?.examId;

      if (!examId) {
        alert("Không tìm thấy bài thi nào.");
        setLoading(false);
        return;
      }

      const examDetails = await apiService.getExamDetails(examId);
      const questionList = examDetails?.data?.question || [];
      const examDuration = parseInt(examDetails?.data?.duration, 10);

      if (questionList.length === 0) {
        alert("Không tìm thấy câu hỏi nào trong bài thi.");
        setLoading(false);
        return;
      }

      setDuration(examDuration || 30);
      setQuestions(questionList);
      setIsStarted(true);
      setCurrentQuestionIndex(0);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi bắt đầu bài kiểm tra:", error);
      alert("Đã xảy ra lỗi khi bắt đầu bài kiểm tra. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleAnswerSelect = (value) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      alert("Bạn đã hoàn thành bài kiểm tra!");
      handleLogout();
    }
  };

  const handleTimeout = () => {
    alert("Hết thời gian làm bài!");
    handleLogout();
  };

  if (!isStarted) {
    return (
        <div className="exam-page">
          <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col xs={24} sm={18} md={12} lg={10}>
              <Button type="primary" onClick={handleStart} loading={loading}>
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
        <Row justify="center" align="middle" style={{minHeight: "100vh"}}>
          <Col xs={24} sm={18} md={12} lg={10}>
            <Timer durationMinutes={duration} onTimeout={handleTimeout}/>
            <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1} // Thêm thứ tự câu hỏi
                totalQuestions={questions.length} // Tổng số câu hỏi
                onNext={handleNextQuestion}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
            />
          </Col>
        </Row>
      </div>
  );
};

export default ExamPage;
