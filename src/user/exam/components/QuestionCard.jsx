import React from "react";
import { Card, Radio, Button } from "antd";

const QuestionCard = ({ question, questionNumber, totalQuestions, onNext, selectedAnswer, onAnswerSelect }) => {
    if (!question) {
        return <div>Loading question...</div>;
    }

    const answers = [
        question.answers[0]?.answer1,
        question.answers[0]?.answer2,
        question.answers[0]?.answer3,
        question.answers[0]?.answer4,
    ];

    return (
        <Card title={`Question ${questionNumber} of ${totalQuestions}`} style={{ marginBottom: "20px" }}>
            <p>{question.questionExam}</p>
            <Radio.Group
                onChange={(e) => onAnswerSelect(e.target.value)}
                value={selectedAnswer}
            >
                {answers.map((answer, index) => (
                    <Radio key={index} value={index + 1}>
                        {answer}
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
