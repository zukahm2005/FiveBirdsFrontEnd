import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Space, Row, Col } from "antd";
import { examData } from "./examData"; // Import dữ liệu examData

const { Title, Text } = Typography;

const ExamPage = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0); // Theo dõi phần hiện tại
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Theo dõi câu hỏi hiện tại
  const [selectedOption, setSelectedOption] = useState(null); // Theo dõi đáp án được chọn
  const [timeLeft, setTimeLeft] = useState(examData.sections[0].timeLimit); // Thời gian còn lại cho phần

  const currentSection = examData.sections[currentSectionIndex]; // Lấy phần hiện tại
  const currentQuestion = currentSection.questions[currentQuestionIndex]; // Lấy câu hỏi hiện tại

  // Hàm giảm thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer); // Dọn dẹp bộ đếm khi component unmount
  }, [currentSectionIndex]);

  // Chuyển đổi thời gian còn lại sang phút:giây
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Xử lý khi chọn đáp án
  const handleOptionClick = (index) => {
    setSelectedOption(index); // Cập nhật đáp án được chọn
  };

  // Xử lý khi chuyển sang câu tiếp theo
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Sang câu tiếp theo
      setSelectedOption(null); // Reset đáp án đã chọn
    } else if (currentSectionIndex < examData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1); // Sang phần tiếp theo
      setCurrentQuestionIndex(0); // Reset câu hỏi về câu đầu tiên
      setTimeLeft(examData.sections[currentSectionIndex + 1].timeLimit); // Reset thời gian
      setSelectedOption(null); // Reset đáp án đã chọn
    } else {
      alert("Bạn đã hoàn thành bài thi!"); // Thông báo hoàn thành bài thi
    }
  };

  return (
    <div className="exam-page">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={24} sm={18} md={12} lg={10}>
          <Card
            bordered={false}
            style={{ borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title level={3} style={{ textAlign: "center", marginBottom: "0" }}>
                {currentSection.title}
              </Title>
              <Text type="secondary" style={{ textAlign: "center", fontSize: "16px" }}>
                Thời gian còn lại:{" "}
                <Text strong type="danger">
                  {formatTime(timeLeft)}
                </Text>
              </Text>
              <Title level={4} style={{ textAlign: "center" }}>
                {currentQuestion.question}
              </Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                {currentQuestion.answers.map((answer, index) => (
                  <Button
                    key={index}
                    type={selectedOption === index ? "primary" : "default"} // Đổi màu khi được chọn
                    size="large"
                    block
                    onClick={() => handleOptionClick(index)} // Gọi hàm khi nhấn
                    style={{
                      borderColor: "#1890ff",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {answer}
                  </Button>
                ))}
              </Space>
              <Button
                type="primary"
                size="large"
                block
                style={{ marginTop: "20px" }}
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < currentSection.questions.length - 1
                  ? "Câu tiếp theo"
                  : currentSectionIndex < examData.sections.length - 1
                  ? "Sang phần tiếp theo"
                  : "Hoàn thành bài thi"}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExamPage;
