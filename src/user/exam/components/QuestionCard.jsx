import { Card, Radio, Typography } from "antd";
import React from "react";
import { GoBookmark } from "react-icons/go";
import { MdClearAll } from "react-icons/md";
import "./QuestionCard.scss";

const { Title, Paragraph } = Typography;

const QuestionCard = ({
    question,
    selectedAnswer,
    onAnswerSelect,
    examTitle,
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
                <div className="question-left">
                    <div className="title-quetion-left">
                        <p>{examTitle || "Exam Title Not Available"}
                        </p>
                        <span>
                            <GoBookmark />
                        </span>
                    </div>

                    <div className="title-question-left">
                        <p>
                            {question.questionExam || "Question Text Not Available"}
                        </p>
                    </div>
                </div>

                <div className="question-right">
                    <div className="header-quest-right">
                        <div className="title-quest">
                            <div className="choices-quest1">
                                <p>Answer choices</p>
                            </div>
                            <div className="choose-quest">
                                <p>Please choose all correct answers.</p>
                            </div>
                        </div>
                        <div className="btn-clear-quest">
                            <MdClearAll /> <p>Clear</p>
                        </div>

                    </div>
                    <Radio.Group
                        className="custom-radio-group"
                        onChange={(e) => onAnswerSelect(e.target.value)}
                        value={selectedAnswer}
                    >
                        {answers.map((answer, index) => (
                            <Radio key={index} value={index + 1} className="custom-radio">
                                <p> {answer}</p>
                            </Radio>
                        ))}
                    </Radio.Group>

                </div>
            </div>

        </Card>
    );
};

export default QuestionCard;
