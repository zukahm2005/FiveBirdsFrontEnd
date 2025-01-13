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
        { id: question.answers[0]?.id, text: question.answers[0]?.answer1, index: 1 },
        { id: question.answers[0]?.id, text: question.answers[0]?.answer2, index: 2 },
        { id: question.answers[0]?.id, text: question.answers[0]?.answer3, index: 3 },
        { id: question.answers[0]?.id, text: question.answers[0]?.answer4, index: 4 },
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
                        onChange={(e) => {
                            const selectedAnswer = answers.find((answer) => answer.index === e.target.value);
                            onAnswerSelect(selectedAnswer.id, selectedAnswer.index);
                        }}
                        value={selectedAnswer?.examAnswer}
                    >
                        {answers.map((answer) => (
                            <Radio key={answer.index} value={answer.index} className="custom-radio">
                                <p>{answer.text}</p>
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>
            </div>

        </Card>
    );
};

export default QuestionCard;
