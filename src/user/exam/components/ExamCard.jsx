import { Button, Spin, Typography } from "antd";
import React from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Logo from "../../components/logo/Logo";
import "./ExamCard.css";
const { Title, Paragraph } = Typography;

const ExamCard = ({ exam, onStartExam, loading }) => {
    return (
        <Spin spinning={loading} tip="Loading exam please wait..." style={{
            fontSize: "24px", // Tăng kích thước chữ
            color: "#ffffff",
            zIndex: 1000,
        }}>

            <div style={{ position: "relative" }} className={loading ? "blur-content" : ""}>

                <div className="exam-card-container">
                    <Logo />
                    <div className="exam-card-header">
                        <Title level={2} className="exam-title"><p>{exam.title}</p></Title>
                        <Paragraph className="exam-description"><p>{exam.description}</p></Paragraph>
                    </div>
                    <div className="exam-card-body">
                        <Paragraph className="instructions-title"><p>INSTRUCTIONS</p></Paragraph>
                        <Paragraph className="instructions-text">
                            1. This is an online Theory/Programming Exam.<br />
                            2. Please make sure that you are using the latest version of the browser. We recommend using Google Chrome<br />
                            3. It's mandatory to disable all the browser extensions and enable Add-ons and open the test in incognito mode.<br />
                            4. For Practical Exam, you are free to choose your preferred programming language from the options that have been listed for you.
                            Note that - All inputs are from STDIN and output to STDOUT.<br />
                            5. To understand our test environment better, or know about other parameter like the time limits, etc you can read our FAQs.<br />
                            6. To know the test results or figure out the next course of action, please contact your test administrator and they will guide you.<br />
                            Best wishes from Nafta! <br />
                        </Paragraph>
                        <Button
                            type="primary"
                            onClick={onStartExam}
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
        </Spin>

    );
};

export default ExamCard;
