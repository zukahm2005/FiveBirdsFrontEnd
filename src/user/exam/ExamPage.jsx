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

  const sections = [
    { name: "Kiến thức chung", count: 6 },
    { name: "Toán học", count: 6 },
    { name: "Công nghệ máy tính", count: 8 },
  ];

  const getCurrentSection = () => {
    let totalCount = 0;
    for (let i = 0; i < sections.length; i++) {
      totalCount += sections[i].count;
      if (currentQuestionIndex < totalCount) {
        return { ...sections[i], sectionIndex: i };
      }
    }
    return null;
  };

  const getQuestionsForCurrentSection = () => {
    const section = getCurrentSection();
    if (!section) return [];
    const sectionStartIndex = sections
        .slice(0, section.sectionIndex)
        .reduce((sum, s) => sum + s.count, 0);
    const sectionEndIndex = sectionStartIndex + section.count;
    return questions.slice(sectionStartIndex, sectionEndIndex);
  };

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

  const handleQuestionClick = (sectionRelativeIndex) => {
    const section = getCurrentSection();
    if (!section) return;
    const sectionStartIndex = sections
        .slice(0, section.sectionIndex)
        .reduce((sum, s) => sum + s.count, 0);
    setCurrentQuestionIndex(sectionStartIndex + sectionRelativeIndex);
    setSelectedAnswer(null);
  };

  const visibleQuestions = getQuestionsForCurrentSection();

  if (!isStarted) {
    const examInfo = {
      title: "TH-7091-Sem 3-Developing Microsoft Azure Solutions",
      description: "20 problems | 40 minutes",
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
          <Timer
              durationMinutes={duration}
              onTimeout={() => alert("Time's up!")}
              sectionTitle={getCurrentSection().name}
          />
        </div>

        <div className="question-navigation">
          <Button
              className="prev-next-btn"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestionIndex === 0}
          >
            Prev
          </Button>

          {visibleQuestions.map((_, index) => {
            const globalQuestionIndex =
                sections.slice(0, getCurrentSection().sectionIndex).reduce((sum, s) => sum + s.count, 0) + index;

            return (
                <Button
                    key={globalQuestionIndex}
                    type={
                      currentQuestionIndex === globalQuestionIndex
                          ? "primary"
                          : "default"
                    }
                    onClick={() => handleQuestionClick(index)}
                >
                  {globalQuestionIndex + 1}
                </Button>
            );
          })}

          <Button
              className="prev-next-btn"
              onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                      Math.min(prev + 1, questions.length - 1)
                  )
              }
              disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </Button>
        </div>


        <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onNext={() =>
                setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                )
            }
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
        />
      </div>
  );
};

export default ExamPage;
