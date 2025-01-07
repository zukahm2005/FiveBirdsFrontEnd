import React from "react";
import { Typography, Button } from "antd";
import "./ExamCard.css";

const { Title, Paragraph } = Typography;

const ExamCard = ({ exam, onStartExam, loading }) => {
    return (
        <div className="exam-card-container">
            <div className="exam-card-header">
                <Title level={2} className="exam-title">{exam.title}</Title>
                <Paragraph className="exam-description">{exam.description}</Paragraph>
            </div>
            <div className="exam-card-body">
                <Paragraph className="instructions-title">INSTRUCTIONS</Paragraph>
                <Paragraph className="instructions-text">
                    1. This is an online Theory/Programming Exam.<br />
                    2. Please make sure that you are using the latest version of the browser.<br />
                    3. Disable all browser extensions and open the test in incognito mode.<br />
                    4. All inputs are from STDIN and output to STDOUT.<br />
                    5. Contact your test administrator for assistance.<br />
                </Paragraph>
                <Button
                    type="primary"
                    onClick={onStartExam}
                    loading={loading}
                    className="start-exam-btn"
                >
                    Start Taking This Assignment
                </Button>
            </div>
        </div>
    );
};

export default ExamCard;
