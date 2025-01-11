import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import GlobalAlert from "../../../common/globalAlert/GlobalAlert";
import "./createtest.scss";
import ImportFile from "./ImportFile.jsx";

const CreateTest = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");

  const [showTitleInput, setShowTitleInput] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [examDescription, setExamDescription] = useState("");
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [examDuration, setExamDuration] = useState("");
  const [candidatePositions, setCandidatePositions] = useState([]);
  const [selectedCandidatePosition, setSelectedCandidatePosition] =useState("");
  const [showCandidatePositionDropdown, setShowCandidatePositionDropdown] = useState(false);


  const [questions, setQuestions] = useState([
    {
      questionExam: "",
      point: "",
      answers: { answer1: "", answer2: "", answer3: "", answer4: "" },
      correctAnswer: "",
      showDetails: true,
    },
  ]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const [loading, setLoading] = useState(false);

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
  useEffect(() => {
    fetchExams();
  }, []);
  const fetchCandidatePositions = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "http://46.202.178.139:5050/api/v1/candidate-positions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const names = response.data.data.map((item) => item.name);
      console.log("Candidate Names:", names);
      const data = response.data.data;
      setCandidatePositions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching candidate positions:", error);
      setAlertType("error");
      setAlertDescription("Failed to fetch candidate positions.");
      setAlertVisible(true);
    }
  };
  

  useEffect(() => {
    fetchCandidatePositions();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!examTitle || !examDescription || !examDuration) {
      setAlertType("warning");
      setAlertDescription("Please fill all fields for the exam.");
      setAlertVisible(true);
      return;
    }
    console.log("Selected Candidate Position ID:", selectedCandidatePosition);

    setLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.post(
        "http://46.202.178.139:5050/api/v1/exams/add",
        {
          title: examTitle,
          description: examDescription,
          duration: examDuration,
          candidatePositionId: selectedCandidatePosition,

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

      await fetchExams();

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
  const fetchExamDetailsById = async (id) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://46.202.178.139:5050/api/v1/exams/get/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const examData = response.data;
      console.log("Fetched exam details:", examData);

      if (examData.questions) {
        setQuestions(
          examData.questions.map((q) => ({
            ...q,
            isNew: false,
          }))
        );
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching exam details:", error);
      setAlertType("error");
      setAlertDescription("Failed to fetch exam details.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExam = async (examId) => {
    setSelectedExam(examId);
    setLoading(true);

    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://46.202.178.139:5050/api/v1/exams/get/${examId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQuestions(response.data.data.question || []);
    } catch (error) {
      console.error("Error fetching exam details:", error);
      setAlertType("error");
      setAlertDescription("Failed to fetch exam details.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        questionExam: "",
        point: "",
        answers: {
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
        },
        correctAnswer: "",
        showDetails: true,
        isNew: true,
      },
    ]);
  };

  const toggleQuestionDetails = (index) => {
    setExpandedQuestions((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const saveNewQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].isNew = false;
    setQuestions(updatedQuestions);
  };


  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "correctAnswer") {
      updatedQuestions[index][field] = parseInt(value, 10) || 0;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[`answer${aIndex}`] = value || "";
    setQuestions(updatedQuestions);
  };

  const handleCreateAll = async () => {
    if (!selectedExam) {
      setAlertType("warning");
      setAlertDescription("Please select an exam.");
      setAlertVisible(true);
      return;
      
    }
    console.log("Alert State Updated:", {
      alertType,
      alertDescription,
      alertVisible,
    });
    setLoading(true);
    const token = Cookies.get("token");

    try {
      const newQuestions = questions.filter((q) => q.isNew);
    
      for (const question of newQuestions) {
        console.log("Payload gửi đến /questions/add:", {
          examId: selectedExam,
          questionExam: question.questionExam,
          point: parseInt(question.point, 10) || 0,
        });
    
        const questionResponse = await axios.post(
          "http://46.202.178.139:5050/api/v1/questions/add",
          {
            examId: selectedExam,
            questionExam: question.questionExam,
            point: parseInt(question.point, 10) || 0,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        const questionId = questionResponse.data?.data?.id;
    
        if (!questionId) {
          throw new Error("Failed to retrieve questionId from the response.");
        }
    
        console.log("Created questionId:", questionId);
    
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
      
    } catch (error) {
      console.error("Error creating questions or answers:", error);
      setAlertType("error");
      setAlertDescription("Failed to create questions and answers.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-questions-answers-container">
      <GlobalAlert
        setVisible={setAlertVisible}
        visible={alertVisible}
        type={alertType}
        description={alertDescription}
      />

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
              className={`dropdown-label ${showDurationInput ? "active" : ""}`}
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
          <div className="exam-group">
  <label
    onClick={() => setShowCandidatePositionDropdown(!showCandidatePositionDropdown)}
    className={`dropdown-label ${showCandidatePositionDropdown ? "active" : ""}`}
  >
    Candidate Position <AiOutlineDown />
  </label>
  {showCandidatePositionDropdown && (
    <select
      value={selectedCandidatePosition}
      onChange={(e) => setSelectedCandidatePosition(e.target.value)}
      className="dropdown-select"
    >
      <option value="">Select a Candidate Position</option>
      {candidatePositions.map((position) => (
        <option key={position.id} value={position.id}>
          {position.name}
        </option>
      ))}
    </select>
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
            onChange={(e) => handleSelectExam(e.target.value)}
          >
            <option value="">Select an Exam</option>
            {Array.isArray(exams) &&
              exams.length > 0 &&
              exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.id} <br/>
                  {exam.title}
                </option>
              ))}
          </select>
        </div>

        <div className="question-list">
          {questions.map((q, index) => (
            <div key={index} className="question-group">
              <div
                className="question-header"
                onClick={() => toggleQuestionDetails(index)}
              >
                <span>
                  {index + 1}.{" "}
                  {q.isNew
                    ? "New Question"
                    : q.questionExam || "Untitled Question"}
                </span>
                <AiOutlineDown
                  className={`dropdown-icon ${
                    expandedQuestions[index] ? "open" : ""
                  }`}
                />
              </div>

              {expandedQuestions[index] && (
                <div className="question-details">
                  {q.isNew ? (
                    <>
                      <label>Question:</label>
                      <input
                        type="text"
                        placeholder="Enter question"
                        value={q.questionExam}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "questionExam",
                            e.target.value
                          )
                        }
                      />

                      <label>Point:</label>
                      <input
                        type="number"
                        placeholder="Enter points"
                        value={q.point}
                        onChange={(e) =>
                          handleQuestionChange(index, "point", e.target.value)
                        }
                      />

                      {[1, 2, 3, 4].map((num) => (
                        <div key={num}>
                          <label>Answer {num}:</label>
                          <input
                            type="text"
                            placeholder={`Answer ${num}`}
                            value={q.answers[`answer${num}`]}
                            onChange={(e) =>
                              handleAnswerChange(index, num, e.target.value)
                            }
                          />
                        </div>
                      ))}
                      <label>Correct Answer:</label>
                      <input
                        type="number"
                        placeholder="Correct Answer (1-4)"
                        value={q.correctAnswer}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <p className="point">Point: {q.point || "N/A"}</p>
                      <p>Answer 1: {q.answers?.[0]?.answer1 || "N/A"}</p>
                      <p>Answer 2: {q.answers?.[0]?.answer2 || "N/A"}</p>
                      <p>Answer 3: {q.answers?.[0]?.answer3 || "N/A"}</p>
                      <p>Answer 4: {q.answers?.[0]?.answer4 || "N/A"}</p>
                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {q.answers?.[0]?.correctAnswer || "N/A"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="button-group-1">
          <div className="add-question-btn">
            <button className="icon-button-left" onClick={handleAddQuestion}>
              <GoPlus/> Add Question
            </button>
          </div>
          <div className="import-file-container">
            <ImportFile selectedExam={selectedExam}/>
          </div>
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
