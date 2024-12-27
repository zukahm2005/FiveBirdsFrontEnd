import React from "react";
import { Button, Space, Typography } from "antd";

const { Title } = Typography;

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect, onNext }) => {
  return (
    <div>
      <Title level={4}>{question.questionExam}</Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        {[
          question.answers[0]?.answer1,
          question.answers[0]?.answer2,
          question.answers[0]?.answer3,
          question.answers[0]?.answer4,
        ].map((answer, index) => (
          <Button
            key={index}
            type={selectedAnswer === index ? "primary" : "default"}
            block
            onClick={() => onAnswerSelect(index)}
          >
            {answer}
          </Button>
        ))}
      </Space>
      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={onNext}
        disabled={selectedAnswer === null}
      >
        Câu tiếp theo
      </Button>
    </div>
  );
};

export default QuestionCard;
