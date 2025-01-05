import React, { useState } from "react";
import { Button } from "antd";
import QuestionCard from "./components/QuestionCard";
import Timer from "./components/Timer";
import { apiService } from "./service/apiService";
import "./ExamPage.css";
import ExamCard from "./components/ExamCard.jsx";

const ExamPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Quản lý trang hiện tại

  const questionsPerPage = 10; // Số lượng câu hỏi mỗi trang

  const handleStart = async () => {
    try {
      setLoading(true);

      const roleData = await apiService.checkRole();
      const userId = roleData.userId;

      const userExams = await apiService.getUserExams(userId);
      const examId = userExams?.data[0]?.exam?.examId;

      const examDetails = await apiService.getExamDetails(examId);
      const questionList = examDetails?.data?.question || [];
      const examDuration = parseInt(examDetails?.data?.duration, 10);

      setDuration(examDuration || 30);
      setQuestions(questionList);
      setIsStarted(true);
      setCurrentQuestionIndex(0);
      setLoading(false);
    } catch (error) {
      console.error("Error starting the exam:", error);
      setLoading(false);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswer(null);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.floor(questions.length / questionsPerPage)));
  };

  const visibleQuestions = questions.slice(
      currentPage * questionsPerPage,
      (currentPage + 1) * questionsPerPage
  );

  if (!isStarted) {
    const examInfo = {
      title: "TH-7091-Sem 3-Developing Microsoft Azure Solutions",
      description: "16 problems | 40 minutes",
    };

    return (
        <div className="exam-page">
          <ExamCard exam={examInfo} onStartExam={handleStart} loading={loading} />
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
      <div className="exam-page">
        <div className="header">
          <Timer durationMinutes={duration} onTimeout={() => alert("Time's up!")} />
        </div>

        <div className="question-navigation">
          <Button className="prev-next-btn" onClick={handlePrevPage} disabled={currentPage === 0}>
            Prev
          </Button>
          {visibleQuestions.map((_, index) => {
            const questionIndex = currentPage * questionsPerPage + index;
            return (
                <Button
                    key={questionIndex}
                    type={questionIndex === currentQuestionIndex ? "primary" : "default"}
                    onClick={() => handleQuestionClick(questionIndex)}
                >
                  {questionIndex + 1}
                </Button>
            );
          })}
          <Button
              className="prev-next-btn"
              onClick={handleNextPage}
              disabled={(currentPage + 1) * questionsPerPage >= questions.length}
          >
            Next
          </Button>
        </div>

        <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onNext={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
        />
      </div>
  );
};

export default ExamPage;