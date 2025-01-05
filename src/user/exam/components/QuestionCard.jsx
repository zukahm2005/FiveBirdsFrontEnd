import React from "react";
import { Card, Radio, Typography, Button } from "antd";
import "./QuestionCard.css";

const { Title, Paragraph } = Typography;

const QuestionCard = ({
                          question,
                          questionNumber,
                          totalQuestions,
                          onPrevious,
                          onNext,
                          onFinish,
                          selectedAnswer,
                          onAnswerSelect,
                          isLastQuestion,
                      }) => {
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
        <Card className="question-card">
            <div className="question-content">
                {/* Câu hỏi */}
                <div className="question-left">
                    <Title level={4}>Question {questionNumber} of {totalQuestions}</Title>
                    <Paragraph>{question.questionExam}</Paragraph>
                </div>

                {/* Đáp án */}
                <div className="question-right">
                    <Radio.Group
                        onChange={(e) => onAnswerSelect(e.target.value)}
                        value={selectedAnswer}
                    >
                        {answers.map((answer, index) => (
                            <Radio key={index} value={index + 1} className="answer-option">
                                {answer}
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>
            </div>

            {/* Footer */}
            <div className="question-footer">
                <Button onClick={onPrevious} disabled={questionNumber === 1}>
                    Previous
                </Button>
                {!isLastQuestion ? (
                    <Button type="primary" onClick={onNext} disabled={!selectedAnswer}>
                        Next
                    </Button>
                ) : (
                    <Button type="primary" danger onClick={onFinish} disabled={!selectedAnswer}>
                        Finish and Submit Assignment
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default QuestionCard;
