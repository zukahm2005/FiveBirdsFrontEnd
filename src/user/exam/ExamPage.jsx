import { Button, Modal } from "antd";
import React, { useState } from "react";
import { BsFillStopFill } from "react-icons/bs";
import { GoClock } from "react-icons/go";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./ExamPage.scss";
import ExamCard from "./components/ExamCard.jsx";
import QuestionCard from "./components/QuestionCard";
import Timer from "./components/Timer";
import { apiService } from "./service/apiService";


const ExamPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [examId, setExamId] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const totalQuestions = 20;
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});


  const handleAnswerSelect = (answerValue) => {
    if (!selectedAnswers[currentQuestionIndex]) {
      setCompletedQuestions(completedQuestions + 1);
    }

    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answerValue });
  };
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
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
      setUserId(roleData.userId);

      const userExams = await apiService.getUserExams(roleData.userId);
      const exam = userExams?.data[0]?.exam;
      setExamId(exam?.examId);

      const examDetails = await apiService.getExamDetails(exam?.examId);
      const questionList = examDetails?.data?.question || [];
      const examDuration = parseInt(examDetails?.data?.duration, 10);

      setDuration(examDuration || 30);
      setQuestions(questionList);
      setAnswers(questionList.map(() => null));
      setIsStarted(true);
      setCurrentQuestionIndex(0);
      setLoading(false);
    } catch (error) {
      console.error("Error starting the exam:", error);
      setLoading(false);
    }
  };

  const saveAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer !== null) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = {
        questionId: currentQuestion.id,
        answerId: selectedAnswer,
        examAnswer: selectedAnswer,
      };
      setAnswers(updatedAnswers);
    }
  };

  const handleFinishExam = async () => {
    try {
      const answerData = answers.map((answer, index) => ({
        userId: Number(userId),
        examId: Number(examId),
        questionId: Number(questions[index]?.id),
        answerId: Number(answer?.answerId || 0),
        examAnswer: Number(answer?.examAnswer || 0),
      }));

      const submitResponse = await apiService.submitAnswer(answerData);
      console.log("submitAnswer response:", submitResponse);

      if (!submitResponse || submitResponse.errorCode !== 200) {
        alert("Có lỗi xảy ra khi nộp bài thi. Vui lòng thử lại.");
        return;
      }

      const testPayload = {
        userId: Number(userId),
        examId: Number(examId),
      };

      const testResponse = await apiService.addTest(testPayload);
      console.log("addTest response:", testResponse);

      if (!testResponse || testResponse.errorCode !== 200) {
        alert("Có lỗi xảy ra khi thêm bài thi. Vui lòng thử lại.");
        return;
      }

      setResultData(testResponse.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error during finish exam:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.href = "/login";
  };

  const handleQuestionClick = (newIndex) => {
    saveAnswer();
    setCurrentQuestionIndex(newIndex);
    setSelectedAnswer(answers[newIndex]?.examAnswer || null);
  };

  if (!isStarted) {
    const examInfo = {
      title: "TH-7091-Sem 3-Developing Microsoft Azure Solutions",
      description: (
        <div className="exam-info">
          <span className="exam-info-details">
            <HiOutlineClipboardDocumentList className="exam-icon" />
            20 problems
          </span>
          <span className="exam-info-details">
            <GoClock className="exam-icon" />
            40 minutes
          </span>
        </div>
      ),
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
          sectionTitle="Quiz Progress"
          totalQuestions={totalQuestions}
          completedQuestions={completedQuestions}
        />
      </div>
      <div className="question-navigation">
        <Button
          className="prev-next-btn"
          onClick={() => handleQuestionClick(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          <IoIosArrowBack />
          PREV
        </Button>
        {getQuestionsForCurrentSection().map((_, index) => {
          const globalQuestionIndex =
            sections
              .slice(0, getCurrentSection().sectionIndex)
              .reduce((sum, s) => sum + s.count, 0) + index;

          return (
            <Button
              key={globalQuestionIndex}
              type={currentQuestionIndex === globalQuestionIndex ? "primary" : "default"}
              onClick={() => handleQuestionClick(globalQuestionIndex)}
              className={selectedAnswers[globalQuestionIndex] ? "selected-dot" : ""}
            >
              {globalQuestionIndex + 1}
            </Button>
          );
        })}

        <Button
          className="prev-next-btn"
          onClick={() => handleQuestionClick(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          NEXT
          <IoIosArrowForward />

        </Button>
      </div>
      <QuestionCard
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        selectedAnswer={selectedAnswers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isLastQuestion={currentQuestionIndex === totalQuestions - 1}

      />
      <div className="footer-completed">
        <Button
          type="primary"
          onClick={handleFinishExam}
          disabled={answers.some((answer) => answer === null)}
        >
          <span> <BsFillStopFill /></span>
          <p>
            FINISH AND SUBMIT
          </p>
        </Button>
      </div>

      <Modal
        title="Test results"
        visible={isModalVisible}
        onOk={handleModalOk}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {resultData && (
          <div>
            <p>ID: {resultData.id}</p>
            <p>User ID: {resultData.username}</p>
            <p>Exam ID: {resultData.examAnswer}</p>
            <p>Point: {resultData.point}</p>
            <p>{resultData.isPast ? "You have been accepted." : "You have failed"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamPage;
