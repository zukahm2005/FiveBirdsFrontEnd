import { Button, Modal, Spin } from "antd";
import React, { useState } from "react";
import { BsFillStopFill } from "react-icons/bs";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Cell, Pie, PieChart } from "recharts";
import "./ExamPage.scss";
import ExamCard from "./components/ExamCard.jsx";
import QuestionCard from "./components/QuestionCard";
import Timer from "./components/Timer";
import { apiService } from "./service/apiService";

const ExamPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [examId, setExamId] = useState(null);
  const [examTitle, setExamTitle] = useState("Exam Title Not Available");
  const [resultData, setResultData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const totalQuestions = questions.length;

  const sections = [
    { name: "General knowledge", count: 6 },
    { name: "Mathematics", count: 6 },
    { name: "Computer technology", count: 8 },
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
      setExamTitle(exam?.title || "Exam Title Not Available");

      const examDetails = await apiService.getExamDetails(exam?.examId);
      const questionList = examDetails?.data?.question || [];
      const examDuration = parseInt(examDetails?.data?.duration, 10);

      setDuration(examDuration || 30);
      setQuestions(questionList);
      setSelectedAnswers({});
      setCompletedQuestions(0);
      setIsStarted(true);
      setCurrentQuestionIndex(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerId, index) => {
    if (!selectedAnswers[currentQuestionIndex]) {
      setCompletedQuestions((prev) => prev + 1);
    }

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: { answerId, examAnswer: index },
    });
  };



  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinishExam = async () => {
    setLoading(true);
    try {
      const answerData = Object.entries(selectedAnswers).map(([index, value]) => ({
        userId: Number(userId),
        examId: Number(examId),
        questionId: Number(questions[index]?.id),
        answerId: Number(value.answerId),
        examAnswer: Number(value.examAnswer),
      }));

      const submitResponse = await apiService.submitAnswer(answerData);

      if (!submitResponse || submitResponse.errorCode !== 200) {
        Modal.error({
          title: "Submission Error",
          content: "An error occurred while submitting your test. Please try again.",
        });
        setLoading(false);
        return;
      }

      const testPayload = {
        userId: Number(userId),
        examId: Number(examId),
      };

      const testResponse = await apiService.addTest(testPayload);

      if (!testResponse || testResponse.errorCode !== 200) {
        Modal.error({
          title: "Test Submission Error",
          content: "There was an error with the test results. Please try again.",
        });
        setLoading(false);
      }

      setResultData(testResponse.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error during finish exam:", error);
      Modal.error({
        title: "Unexpected Error",
        content: "Please check again and submit.",
      });
    }
    setLoading(false);
  };


  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.href = "/candidate-login";
  };

  if (!isStarted) {
    const examInfo = {
      title: "Welcome to the screening screen!",
      description: (
        <div className="exam-info">
          <span className="exam-info-details">
            <HiOutlineClipboardDocumentList className="exam-icon" />
            20 problems
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

  const data = [
    { name: "Yes", value: 66 },
    { name: "No", value: 34 },
  ];

  const COLORS = ["rgb(24, 159, 204)", "rgb(199, 30, 30)"];

  return (
    <Spin spinning={loading} tip="Processing your exam, please wait...">

      <div className="exam-page">
        <div className="header">
          <Timer
            durationMinutes={duration}
            onTimeout={() => {
              Modal.warning({
                title: "Time's up!",
                content: "The test time has ended. Please submit your test.",
                onOk: handleFinishExam,
              });
            }}
            sectionTitle={getCurrentSection()?.name}
            totalQuestions={totalQuestions}
            completedQuestions={completedQuestions}
          />
        </div>
        <div className="question-navigation">
          <Button
            className="prev-next-btn"
            onClick={handlePrevious}
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
                onClick={() => setCurrentQuestionIndex(globalQuestionIndex)}
                className={selectedAnswers[globalQuestionIndex]?.examAnswer ? "selected-dot" : ""}
              >
                {globalQuestionIndex + 1}
              </Button>
            );
          })}

          <Button
            className="prev-next-btn"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            NEXT
            <IoIosArrowForward />
          </Button>
        </div>
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          examTitle={examTitle}
        />
        <div className="footer-completed">
          <Button
            type="primary"
            onClick={handleFinishExam}
            disabled={completedQuestions !== totalQuestions}
          >
            <BsFillStopFill />
            FINISH AND SUBMIT
          </Button>
        </div>
        <Modal

          visible={isModalVisible}
          onOk={handleModalOk}
          cancelButtonProps={{ style: { display: "none" } }}
          width="50vw"
          bodyStyle={{
            height: "60vh",
            padding: 0,
          }}
        >
          {resultData && (
            <div className="rate-container">
              <div className="title-pass-exam">
                <p>{resultData.isPast ? "You have been accepted." : "You have failed."}</p>

              </div>
              <div className="your-point">
                <p>Your Point: {resultData.point}</p>
              </div>

              <div style={{ width: "100%", height: "100%" }} >
                <PieChart width={1000} height={400}>
                  <Pie
                    data={data}
                    dataKey="value"
                    cx="45%"
                    cy="75%"
                    startAngle={180}
                    endAngle={0}
                    outerRadius={290}
                    innerRadius={130}
                    fill="#8884d8"
                    label={({ name, percent }) =>
                      `${name} ${Math.round(percent * 100)}%`
                    }
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Pie
                    data={[{ value: 100 }]}
                    dataKey="value"
                    cx="50%"
                    cy="100%"
                    outerRadius={70}
                    fill="#FFFFFF"
                  />
                </PieChart>
              </div>
              <div className="rate-container-time">
                <p>Times: 20ph30s</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Spin>

  );
};

export default ExamPage;
