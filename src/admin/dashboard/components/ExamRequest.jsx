import React, { useState } from "react";
import { Modal, Select, Input, Tag, Button, DatePicker, TimePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import "./ExamRequst.scss";
import axios from "axios";
import GlobalAlert from "../../../common/globalAlert/GlobalAlert";
import { sendEmailCandidate } from "../../../common/api/apiDashBoard";

const { Option } = Select;
const { TextArea } = Input;

const ExamRequest = ({ exam, data, onClose, setClose, setSelectedRows, setSelectedRowKeys, selectedRowKeys }) => {
    const [examTitle, setExams] = useState(null);
    const [comment, setComment] = useState(null);
    const [candidateColors, setCandidateColors] = useState({});
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const [alertType, setAlertType] = useState(null);
    const [alertDescription, setAlertDescription] = useState(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    dayjs.extend(customParseFormat);

    const handleUpdate = async () => {
        try { 
            if (data.length === 0) {
                throw new Error("No data to process."); 
            }
            const requests = data.map((item) =>
                sendEmailCandidate(examTitle, comment, selectedTime, selectedDate, item.id)
            );
            await Promise.all(requests);
            
            setAlertDescription("All emails sent successfully.");
            setAlertType("success");

            setExams('')
            setComment('')
            setSelectedTime(null)
            setSelectedDate(null)
            setSelectedRows([]);
            setSelectedRowKeys([]);
            setVisible(true);
            setLoading(false)
        } catch (error) {
            setAlertDescription("Error sending emails. Please try again.");
            setAlertType("error");
            setVisible(true);
            setLoading(false)
        }
    };

    const onRemoveCandidate = (candidateId) => {
        setSelectedRows(prevData => prevData.filter(candidate => candidate.id !== candidateId));
        setSelectedRowKeys(prevKeys => prevKeys.filter(id => id !== candidateId));
    };


    const handleOnclose = () => {
        setSelectedRows([]);
        setSelectedRowKeys([]);
        setClose(!onClose);
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getColorForCandidate = (candidateId) => {
        if (!candidateColors[candidateId]) {
            const newColor = getRandomColor();
            setCandidateColors((prev) => ({ ...prev, [candidateId]: newColor }));
            return newColor;
        }
        return candidateColors[candidateId];
    };

    return (
        <div className="updateStatus">
            <GlobalAlert setVisible={setVisible} visible={visible} type={alertType} description={alertDescription} />
            <div style={{ padding: "0 10px 20px 0px", borderBlockEnd: "2px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
                <h2>Send Exam Schedule</h2>
                <CloseOutlined onClick={handleOnclose} />
            </div>
            <div>
                <div style={{ marginBottom: 16 }}>
                    <p style={{ padding: "20px 0 10px 0" }}>Add Candidates</p>
                    <div className="boxCandidate">
                        {data.length > 0 ? (
                            data.map((candidate) => (
                                <Tag
                                    className="tag-status"
                                    key={`${candidate.id}-${candidate.fullName}`}
                                    style={{ border: `2px solid ${getColorForCandidate(candidate.id)}` }}
                                    closable
                                    onClose={() => { onRemoveCandidate(candidate.id); }}
                                >
                                    {candidate.fullName}
                                </Tag>
                            ))
                        ) : (
                            <div style={{ color: "gray", opacity: "0.7" }}>No candidate</div>
                        )}
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Exam</label>
                    <Select
                        style={{ width: "100%", marginTop: 8 }}
                        placeholder="Select Exam"
                        value={examTitle || undefined}
                        onChange={setExams}
                    >
                        {exam.map((status) => (
                            <Option key={status.id} value={status.title}>
                                {status.id} {status.title}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ paddingBottom: "20px" }}>
                    <div style={{ gap: "10px", display: "flex" }}>
                        <div style={{ width: "50%", marginTop: "10px" }} >
                            <label>Time</label><br />
                            <TimePicker
                                style={{ width: '100%', marginTop: "7px" }}
                                onChange={(time, timeString) => setSelectedTime(timeString)}
                                defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
                            />
                        </div>
                        <div style={{ width: "50%", marginTop: "10px" }} >
                            <label>Date</label><br />
                            <DatePicker
                                style={{ width: '100%', marginTop: "7px" }}
                                onChange={(date, dateString) => setSelectedDate(dateString)}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Message</label>
                    <TextArea
                        rows={5}
                        placeholder="Enter a message"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ marginTop: 8 }}
                    />
                </div>

                <div style={{ textAlign: "right" }}>
                    <Button onClick={handleOnclose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={() => { setLoading(true); handleUpdate(); }} loading={loading} >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExamRequest;
