import React from "react";
import { Card, Typography, Button } from "antd";

const { Title } = Typography;

const ExamCard = ({ exam, onStartExam }) => {
  return (
    <Card style={{ marginBottom: "20px" }}>
      <Title level={4}>{exam.title}</Title>
      <p>{exam.description}</p>
      <Button type="primary" onClick={() => onStartExam(exam)}>
        Bắt đầu bài thi
      </Button>
    </Card>
  );
};

export default ExamCard;
