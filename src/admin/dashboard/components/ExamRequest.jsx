import React, { useState } from "react";
import { Modal, Select, Input, Tag, Button, DatePicker, TimePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import "./examRequst.scss";

const { Option } = Select;
const { TextArea } = Input;

const ExamRequest = ({ exam, data, onClose, setClose, setSelectedRows, setSelectedRowKeys, selectedRowKeys }) => {
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [status, setStatus] = useState(null);
    const [comment, setComment] = useState("");
    const [candidateColors, setCandidateColors] = useState({});


    const handleUpdate = () => {
        console.log("Candidates:", selectedCandidates);
        console.log("Status:", status);
        console.log("Comment:", comment);
        onClose();
    };

    const onRemoveCandidate = (candidateId) => {
        const updatedData = data.filter(candidate => candidate.id !== candidateId);
        setSelectedRows(updatedData);

        const updatedRowKeys = [...selectedRowKeys];
        const index = updatedRowKeys.indexOf(candidateId);
        if (index > -1) {
            updatedRowKeys.splice(index, 1);
        }
        setSelectedRowKeys(updatedRowKeys);
    };
    const handleOnclose = () => {
        setSelectedRows([])
        setSelectedRowKeys([])
        setClose(!onClose)
    }

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    dayjs.extend(customParseFormat);
    const onChangeTimes = (time, timeString) => {
        console.log(time, timeString);
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
            <div style={{ padding: "0 10px 20px 0px", borderBlockEnd: "2px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
                <h2>Update Status</h2>
                <CloseOutlined onClick={handleOnclose} />
            </div>
            <div>
                <div style={{ marginBottom: 16 }}>
                    <p style={{ padding: "20px 0 10px 0" }}>Add Candidates</p>
                    <div className="boxCandidate" >
                        {data.map((candidate) => (
                            <Tag
                                className="tag-status"
                                key={candidate.fullName}
                                color={getColorForCandidate(candidate.id)}
                                closable
                                onClose={() => onRemoveCandidate(candidate.id)}
                            >
                                {candidate.fullName}
                            </Tag>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Exam</label>
                    <Select
                        style={{ width: "100%", marginTop: 8 }}
                        placeholder="Select status"
                        value={status}
                        onChange={setStatus}
                    >
                        {exam.map((status) => (
                            <Option key={status.id} value={status.id}>
                                {status.title}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ paddingBottom: "20px" }}>

                    <div style={{ gap: "10px", display: "flex" }}>
                        <div style={{ width: "35%", marginTop: "10px" }} >
                            <label>Time</label><br />
                            <TimePicker style={{width: '100%',  marginTop: "7px"}} onChange={onChangeTimes} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                        </div>
                        <div style={{ width: "65%", marginTop: "10px" }} >
                            <label>Date</label><br />
                            <DatePicker style={{width: '100%', marginTop: "7px"}} onChange={onChange} />
                        </div>
                    </div>

                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Comment</label>
                    <TextArea
                        rows={10}
                        placeholder="Enter a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ marginTop: 8 }}
                    />
                </div>

                <div style={{ textAlign: "right" }}>
                    <Button onClick={handleOnclose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleUpdate}>
                        Update Status
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExamRequest;
