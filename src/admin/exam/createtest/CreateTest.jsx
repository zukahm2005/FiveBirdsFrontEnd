import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Typography, Collapse, Divider } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import ImportFile from "./ImportFile";
import "./createtest.scss";

const { Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const CreateTest = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [candidatePositions, setCandidatePositions] = useState([]);
  const [selectedCandidatePosition, setSelectedCandidatePosition] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchCandidatePositions();
  }, []);

  const fetchExams = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
          "http://46.202.178.139:5050/api/v1/exams/get/all?pageNumber=0&pageSize=1000",
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setExams(response.data.data || []);
    } catch (error) {
      message.error("Failed to fetch exams.");
    }
  };

  const fetchCandidatePositions = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
          "http://46.202.178.139:5050/api/v1/candidate-positions",
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidatePositions(response.data.data || []);
    } catch (error) {
      message.error("Failed to fetch candidate positions.");
    }
  };

  const handleCreateExam = async () => {
    if (!examTitle || !examDescription || !examDuration || !selectedCandidatePosition) {
      message.warning("Please fill in all the required fields.");
      return;
    }

    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.post(
          "http://46.202.178.139:5050/api/v1/exams/add",
          {
            title: examTitle,
            description: examDescription,
            duration: examDuration.toString(),
            candidatePositionId: selectedCandidatePosition,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      if (response.status === 201 || response.status === 200) {
        message.success(response.data.message || "Exam created successfully!");
        fetchExams();
        setExamTitle("");
        setExamDescription("");
        setExamDuration("");
        setSelectedCandidatePosition("");
      } else {
        throw new Error(response.data?.message || "Unexpected response from the server.");
      }
    } catch (error) {
      message.error(
          error.response?.data?.message || "Failed to create exam. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  const handleSelectExam = async (examId) => {
    setSelectedExam(examId);
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
          `http://46.202.178.139:5050/api/v1/exams/get/${examId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      const examData = response.data?.data || {};
      const mappedQuestions =
          examData.question?.map((q) => ({
            id: q.id,
            questionExam: q.questionExam,
            point: q.point,
            answers: {
              answer1: q.answers?.[0]?.answer1 || "",
              answer2: q.answers?.[0]?.answer2 || "",
              answer3: q.answers?.[0]?.answer3 || "",
              answer4: q.answers?.[0]?.answer4 || "",
            },
            correctAnswer: q.answers?.[0]?.correctAnswer || "",
          })) || [];

      setQuestions(mappedQuestions);
    } catch (error) {
      message.error("Failed to fetch exam details.");
    }
  };

  const handleAddQuestion = () => {
    setNewQuestion({
      questionExam: "",
      point: "",
      answers: {
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
      },
      correctAnswer: "",
    });
  };

  const handleSaveNewQuestion = () => {
    if (
        !newQuestion.questionExam ||
        !newQuestion.point ||
        !newQuestion.answers.answer1 ||
        !newQuestion.answers.answer2 ||
        !newQuestion.answers.answer3 ||
        !newQuestion.answers.answer4 ||
        !newQuestion.correctAnswer
    ) {
      message.warning("Please fill in all fields for the new question.");
      return;
    }

    setQuestions((prev) => [...prev, { ...newQuestion, isNew: true }]);
    setNewQuestion(null);
    message.success("Question added to the list.");
  };

  const handleCreateAllQuestions = async () => {
    if (!selectedExam) {
      message.warning("Please select an exam.");
      return;
    }

    const token = Cookies.get("token");
    try {
      for (const question of questions) {
        if (question.isNew) {
          const questionResponse = await axios.post(
              "http://46.202.178.139:5050/api/v1/questions/add",
              {
                examId: selectedExam,
                questionExam: question.questionExam,
                point: parseInt(question.point, 10),
              },
              { headers: { Authorization: `Bearer ${token}` } }
          );

          const questionId = questionResponse.data?.data?.id;
          await axios.post(
              "http://46.202.178.139:5050/api/v1/answers/add",
              {
                questionId,
                ...question.answers,
                correctAnswer: parseInt(question.correctAnswer, 10),
              },
              { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      message.success("All questions created successfully!");
    } catch (error) {
      message.error("Failed to create questions.");
    }
  };

  return (
      <div className="manage-questions-answers-container">
        <div className="left-section">
          <Title level={2}>Create Exam</Title>
          <Form layout="vertical" onFinish={handleCreateExam}>
            <Form.Item label="Exam Title" required>
              <Input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
            </Form.Item>
            <Form.Item label="Exam Description" required>
              <Input value={examDescription} onChange={(e) => setExamDescription(e.target.value)} />
            </Form.Item>
            <Form.Item label="Exam Duration (minutes)" required>
              <Input
                  type="number"
                  value={examDuration}
                  onChange={(e) => setExamDuration(e.target.value.toString())}
              />
            </Form.Item>
            <Form.Item label="Candidate Position" required>
              <Select
                  value={selectedCandidatePosition}
                  onChange={(value) => setSelectedCandidatePosition(value)}
                  placeholder="Select Candidate Position"
              >
                {candidatePositions.map((position) => (
                    <Option key={position.id} value={position.id}>
                      {position.name}
                    </Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" onClick={handleCreateExam} block loading={loading}>
              Create Exam
            </Button>
          </Form>
        </div>

        <div className="right-section">
          <Title level={2}>Manage Questions and Answers</Title>
          <Form layout="vertical">
            <Form.Item label="Select Exam">
              <Select value={selectedExam} onChange={handleSelectExam}>
                {exams.map((exam) => (
                    <Option key={exam.id} value={exam.id}>
                      {exam.title}
                    </Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc" }}>
              <Collapse>
                {questions.map((q, index) => (
                    <Panel header={q.questionExam || `Question ${index + 1}`} key={index}>
                      <p>Points: {q.point}</p>
                      <p>Answer1: {q.answers.answer1}</p>
                      <p>Answer2: {q.answers.answer2}</p>
                      <p>Answer3: {q.answers.answer3}</p>
                      <p>Answer4: {q.answers.answer4}</p>
                      <p>Correct Answer: {q.correctAnswer}</p>
                    </Panel>
                ))}
              </Collapse>
            </div>

            {newQuestion && (
                <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
                  <Form layout="vertical">
                    <Form.Item label="Question Text" required>
                      <Input
                          value={newQuestion.questionExam}
                          onChange={(e) =>
                              setNewQuestion((prev) => ({ ...prev, questionExam: e.target.value }))
                          }
                      />
                    </Form.Item>
                    <Form.Item label="Points" required>
                      <Input
                          value={newQuestion.point}
                          onChange={(e) =>
                              setNewQuestion((prev) => ({ ...prev, point: e.target.value }))
                          }
                      />
                    </Form.Item>
                    {["answer1", "answer2", "answer3", "answer4"].map((key, index) => (
                        <Form.Item label={`Answer ${index + 1}`} key={key} required>
                          <Input
                              value={newQuestion.answers[key]}
                              onChange={(e) =>
                                  setNewQuestion((prev) => ({
                                    ...prev,
                                    answers: { ...prev.answers, [key]: e.target.value },
                                  }))
                              }
                          />
                        </Form.Item>
                    ))}
                    <Form.Item label="Correct Answer (1-4)" required>
                      <Input
                          value={newQuestion.correctAnswer}
                          onChange={(e) =>
                              setNewQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))
                          }
                      />
                    </Form.Item>
                    <Button type="primary" onClick={handleSaveNewQuestion} block>
                      Save
                    </Button>
                  </Form>
                </div>
            )}

            <Button type="dashed" onClick={handleAddQuestion} block style={{ marginTop: "10px" }}>
              Add Question
            </Button>

            <Divider />

            <ImportFile />

            <Divider />

            <Button type="primary" onClick={handleCreateAllQuestions} block>
              Save All Questions
            </Button>
          </Form>
        </div>
      </div>
  );
};

export default CreateTest;
