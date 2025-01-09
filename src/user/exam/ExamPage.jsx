import { Modal, Button } from "antd";
import React, { useState } from "react";
import { GoClock } from "react-icons/go";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import "./ExamPage.css";
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
  const [resultData, setResultData] = useState(null); // Lưu dữ liệu kết quả từ API
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị Modal

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

      // Lưu dữ liệu và hiển thị Modal
      setResultData(testResponse.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error during finish exam:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.href = "/login"; // Chuyển hướng về trang login sau khi đóng Modal
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
              sectionTitle={getCurrentSection()?.name}
          />
        </div>
        <div className="question-navigation">
          <Button
              className="prev-next-btn"
              onClick={() => handleQuestionClick(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
          >
            Prev
          </Button>
          {getQuestionsForCurrentSection().map((_, index) => {
            const globalQuestionIndex =
                sections
                    .slice(0, getCurrentSection().sectionIndex)
                    .reduce((sum, s) => sum + s.count, 0) + index;

            return (
                <Button
                    key={globalQuestionIndex}
                    type={
                      currentQuestionIndex === globalQuestionIndex
                          ? "primary"
                          : "default"
                    }
                    onClick={() => handleQuestionClick(globalQuestionIndex)}
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
            Next
          </Button>
        </div>
        <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
        />
        <div className="footer">
          <Button
              type="primary"
              onClick={handleFinishExam}
              disabled={answers.some((answer) => answer === null)}
          >
            Hoàn thành bài thi
          </Button>
        </div>

        {/* Modal hiển thị kết quả */}
        <Modal
            title="Kết quả bài thi"
            visible={isModalVisible}
            onOk={handleModalOk}
            cancelButtonProps={{ style: { display: "none" } }}
        >
          {resultData && (
              <div>
                <p>ID: {resultData.id}</p>
                <p>User ID: {resultData.userId}</p>
                <p>Exam ID: {resultData.examId}</p>
                <p>Điểm: {resultData.point}</p>
                <p>{resultData.isPast ? "Bạn đã trúng tuyển" : "Bạn đã trượt"}</p>
              </div>
          )}
        </Modal>
      </div>
  );
};

export default ExamPage;
