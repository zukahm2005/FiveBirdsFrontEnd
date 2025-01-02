import React from "react";
import { Card, Radio, Button } from "antd";

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect, onNext }) => {
    return (
        <Card title={`Question ${question.id}`} style={{ marginBottom: "20px" }}>
            <p>{question.content}</p>
            <Radio.Group
                onChange={(e) => onAnswerSelect(e.target.value)}
                value={selectedAnswer}
            >
                {question.options.map((option, index) => (
                    <Radio key={index} value={index}>
                        {option}
                    </Radio>
                ))}
            </Radio.Group>
            <Button
                type="primary"
                onClick={onNext}
                disabled={selectedAnswer === null}
                style={{ marginTop: "20px" }}
            >
                Next
            </Button>
        </Card>
    );
};

export default QuestionCard;
