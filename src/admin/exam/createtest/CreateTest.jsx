import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import GlobalAlert from "../../../common/globalAlert/GlobalAlert";
import "./createtest.scss";

const CreateTest = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");

  // States for Exam
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [examDescription, setExamDescription] = useState("");
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [examDuration, setExamDuration] = useState("");

  // States for questions
  const [questions, setQuestions] = useState([
    {
      question: "",
      point: "",
      answers: { answer1: "", answer2: "", answer3: "", answer4: "" },
      correctAnswer: "",
      showDetails: true,
    },
  ]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch exams from API
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "http://46.202.178.139:5050/api/v1/exams/get/all?pageNumber=0&pageSize=1000",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExams(response.data.data || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setAlertType("error");
        setAlertDescription("Failed to fetch exams.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Handle creating an exam
  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!examTitle || !examDescription || !examDuration) {
      setAlertType("warning");
      setAlertDescription("Please fill all fields for the exam.");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        "http://46.202.178.139:5050/api/v1/exams/add",
        {
          title: examTitle,
          description: examDescription,
          duration: examDuration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertType("success");
      setAlertDescription("Exam created successfully!");
      setAlertVisible(true);
      setExams([...exams, response.data]);
      setExamTitle("");
      setExamDescription("");
      setExamDuration("");
    } catch (error) {
      console.error("Error creating exam:", error);
      setAlertType("error");
      setAlertDescription("Failed to create exam.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Add a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        point: "",
        answers: { answer1: "", answer2: "", answer3: "", answer4: "" },
        correctAnswer: "",
        showDetails: true,
      },
    ]);
  };

  // Handle question input change
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Handle answer input change
  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[`answer${aIndex}`] = value;
    setQuestions(updatedQuestions);
  };

  // Submit all questions and answers
  const handleCreateAll = async () => {
    if (!selectedExam) {
      setAlertType("warning");
      setAlertDescription("Please select an exam.");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    const token = Cookies.get("token");
    try {
      for (const question of questions) {
        // Create question
        const questionResponse = await axios.post(
          "http://46.202.178.139:5050/api/v1/questions/add",
          {
            examId: selectedExam,
            questionExam: question.question,
            point: question.point,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const questionId = questionResponse.data?.data?.id;

        // Add answers linked to the question
        await axios.post(
          "http://46.202.178.139:5050/api/v1/answers/add",
          {
            questionId: questionId,
            answer1: question.answers.answer1,
            answer2: question.answers.answer2,
            answer3: question.answers.answer3,
            answer4: question.answers.answer4,
            correctAnswer: parseInt(question.correctAnswer, 10),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setAlertType("success");
      setAlertDescription("All questions and answers created successfully!");
      setAlertVisible(true);
      setQuestions([
        {
          question: "",
          point: "",
          answers: { answer1: "", answer2: "", answer3: "", answer4: "" },
          correctAnswer: "",
          showDetails: true,
        },
      ]);
    } catch (error) {
      console.error("Error creating questions or answers:", error);
      setAlertType("error");
      setAlertDescription("Failed to create questions and answers.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionDetails = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].showDetails = !updatedQuestions[index].showDetails;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="manage-questions-answers-container">
      <GlobalAlert
        setVisible={setAlertVisible}
        visible={alertVisible}
        type={alertType}
        description={alertDescription}
      />

      {/* Left Section: Create Exam */}
      <div className="left-section">
        <h2>Create Exam</h2>
        <form onSubmit={handleCreateExam} className="exam-form">
          <div className="exam-group">
            <label
              onClick={() => setShowTitleInput(!showTitleInput)}
              className={`dropdown-label ${showTitleInput ? "active" : ""}`}
            >
              Exam Title <AiOutlineDown />
            </label>
            {showTitleInput && (
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="Enter exam title"
                className="dropdown-input"
              />
            )}
          </div>
          <div className="exam-group">
            <label
              onClick={() => setShowDescriptionInput(!showDescriptionInput)}
              className={`dropdown-label ${
                showDescriptionInput ? "active" : ""
              }`}
            >
              Exam Description <AiOutlineDown />
            </label>
            {showDescriptionInput && (
              <input
                type="text"
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                placeholder="Enter exam description"
                className="dropdown-input"
              />
            )}
          </div>
          <div className="exam-group">
            <label
              onClick={() => setShowDurationInput(!showDurationInput)}
              className={`dropdown-label ${
                showDurationInput ? "active" : ""
              }`}
            >
              Exam Duration <AiOutlineDown />
            </label>
            {showDurationInput && (
              <input
                type="number"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
                placeholder="Enter exam duration (in minutes)"
                className="dropdown-input"
              />
            )}
          </div>
          <button type="submit" className="submit-btn create-exam-btn">
            Create Exam
          </button>
        </form>
      </div>

      {/* Right Section: Manage Questions and Answers */}
      <div className="right-section">
        <h2>Manage Questions and Answers</h2>
        <div className="form-group">
          <label>Select Exam:</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">Select an Exam</option>
            {Array.isArray(exams) && exams.length > 0 ? (
              exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No exams available
              </option>
            )}
          </select>
        </div>

        {/* Questions List */}
        <div className="question-list">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-group">
              <div
                className="question-header"
                onClick={() => toggleQuestionDetails(qIndex)}
              >
                <span>Question {qIndex + 1}</span>
                <AiOutlineDown
                  className={`dropdown-icon ${q.showDetails ? "open" : ""}`}
                />
              </div>
              {q.showDetails && (
                <div className="question-details">
                  <input
                    type="text"
                    placeholder="Enter question"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Enter points"
                    value={q.point}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "point", e.target.value)
                    }
                  />
                  {Object.keys(q.answers).map((key, aIndex) => (
                    <input
                      key={aIndex}
                      type="text"
                      placeholder={`Answer ${aIndex + 1}`}
                      value={q.answers[key]}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, aIndex + 1, e.target.value)
                      }
                    />
                  ))}
                  <input
                    type="number"
                    placeholder="Correct Answer (1-4)"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="icon-button-left" onClick={handleAddQuestion}>
            <GoPlus /> Add Question
          </button>
          <button
            className="submit-btn create-questions-btn"
            onClick={handleCreateAll}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
