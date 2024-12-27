import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import ExamCard from "./components/ExamCard";
import QuestionCard from "./components/QuestionCard";
import Timer from "./components/Timer";
import { apiService } from "./service/apiService";

const ExamPage = () => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await apiService.getAllExams(1);
        if (response.errorCode === 200) {
          setExams(response.data);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = (exam) => {
    setCurrentExam(exam);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentExam.question.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      alert("Bạn đã hoàn thành bài thi!");
      setCurrentExam(null);
    }
  };

  const handleTimeout = () => {
    alert("Hết thời gian làm bài!");
    setCurrentExam(null);
  };

  if (!currentExam) {
    return (
      <div className="exam-page">
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={18} md={12} lg={10}>
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} onStartExam={handleStartExam} />
            ))}
          </Col>
        </Row>
      </div>
    );
  }

  const currentQuestion = currentExam.question[currentQuestionIndex];

  return (
    <div className="exam-page">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={24} sm={18} md={12} lg={10}>
          <Timer duration={parseInt(currentExam.duration) * 60} onTimeout={handleTimeout} />
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
