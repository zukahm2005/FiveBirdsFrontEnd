import { Button, Typography } from "antd";
import React from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Logo from "../../components/logo/Logo";
import "./ExamCard.css";
const { Title, Paragraph } = Typography;

const ExamCard = ({ exam, onStartExam, loading }) => {
    return (
        <div style={{ position: "relative" }}>
           
            <div className="exam-card-container">
                <Logo className="logo-container"/>
                <div className="exam-card-header">
                    <Title level={2} className="exam-title"><p>{exam.title}</p></Title>
                    <Paragraph className="exam-description"><p>{exam.description}</p></Paragraph>
                </div>
                <div className="exam-card-body">
                    <Paragraph className="instructions-title"><p>INSTRUCTIONS</p></Paragraph>
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
                        <p><FaPlay /> START TAKING THIS ASSIGMENT</p>
                    </Button>
                    <div className="instructions-info">
                        <p><IoMdInformationCircleOutline /></p>
                        <p><i>Please proceed to start taking this assignment.</i></p>
                    </div>
                </div>
            </div>

        </div>


    );
};

export default ExamCard;
