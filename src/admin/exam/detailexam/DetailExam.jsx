import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalAlert from "../../../common/globalAlert/GlobalAlert";
import { AiOutlineDown } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import { GoPlus } from "react-icons/go";


import "./detailexam.scss";

const DetailExam = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false); // Điều khiển popup
  const [editingQuestion, setEditingQuestion] = useState(null); // Lưu question đang được chỉnh sửa
  const [candidatePositions, setCandidatePositions] = useState([]); // Danh sách Candidate Positions
  const [showCandidatePositionDropdown, setShowCandidatePositionDropdown] =
    useState(false); // Kiểm soát dropdown Candidate Position
  const [questions, setQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [isEditingLoading, setIsEditingLoading] = useState(false); // Loading khi edit
  const [isSavingQuestionsLoading, setIsSavingQuestionsLoading] = useState(false); // Loading khi save câu hỏi mới
  
  // State to control dropdown for each question
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchExamDetails = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `http://46.202.178.139:5050/api/v1/exams/get/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data.data;
        // Gán candidatePositionId từ response vào state exam
        setExam({
          ...data,
          candidatePositionId: data.candidatePosition.id, // Lưu id của candidatePosition
        });
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setAlertType("error");
        setAlertDescription("Failed to fetch exam details.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [id]);

  useEffect(() => {
    const fetchCandidatePositions = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "http://46.202.178.139:5050/api/v1/candidate-positions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCandidatePositions(response.data.data || []); // Lưu danh sách Candidate Positions
      } catch (error) {
        console.error("Error fetching candidate positions:", error);
        setAlertType("error");
        setAlertDescription("Failed to fetch candidate positions.");
        setAlertVisible(true);
      }
    };
    fetchCandidatePositions();
  }, []);

  const handleAddQuestion = () => {
    setNewQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        questionExam: "",
        point: "",
        answers: { answer1: "", answer2: "", answer3: "", answer4: "" },
        correctAnswer: "",
        showDetails: true,
      },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuestions];
    if (field === "correctAnswer") {
      updatedQuestions[index][field] = parseInt(value, 10) || 0;
    } else {
      updatedQuestions[index][field] = value;
    }
    setNewQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[qIndex].answers[`answer${aIndex}`] = value || "";
    setNewQuestions(updatedQuestions);
  };

  const handleCreateQuestions = async () => {
    setIsSavingQuestionsLoading(true); // Bắt đầu loading

    try {
      const token = Cookies.get("token");

      for (const question of newQuestions) {
        const questionResponse = await axios.post(
          "http://46.202.178.139:5050/api/v1/questions/add",
          {
            examId: exam.id,
            questionExam: question.questionExam,
            point: parseInt(question.point, 10),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const questionId = questionResponse.data?.data?.id;
        if (!questionId) throw new Error("Không thể lấy ID câu hỏi.");

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

      // Lấy danh sách câu hỏi mới nhất
      const response = await axios.get(
        `http://46.202.178.139:5050/api/v1/exams/get/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExam(response.data.data);

      setNewQuestions([]);
      setAlertType("success");
      setAlertDescription("Questions added successfully!");
      setAlertVisible(true);
    } catch (error) {
      console.error("Error creating questions:", error);
      setAlertType("error");
      setAlertDescription("Failed to add questions.");
      setAlertVisible(true);
    } finally {
      setIsSavingQuestionsLoading(false); // Kết thúc loading
    }
  };

  const handleUpdateExam = async () => {
    try {
      const token = Cookies.get("token");
      const payload = {
        title: exam.title,
        description: exam.description,
        duration: exam.duration.toString(), // Chuyển duration thành string
        candidatePositionId: exam.candidatePositionId, // Thêm candidatePositionId vào payload
      };

      console.log("Payload:", payload);

      const response = await axios.put(
        `http://46.202.178.139:5050/api/v1/exams/update/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlertType("success");
      setAlertDescription("Exam updated successfully!");
      setAlertVisible(true);
    } catch (error) {
      console.error("Error updating exam:", error.response?.data || error);
      setAlertType("error");
      setAlertDescription("Failed to update exam.");
      setAlertVisible(true);
    }
  };
  const handleEditQuestion = (questionId) => {
    const question = exam.question.find((q) => q.id === questionId);
    setEditingQuestion(question);
    setShowEditPopup(true);
  };
  const handleSaveEdit = async () => {
    setIsEditingLoading(true); // Bắt đầu loading
    try {
      const token = Cookies.get("token");

      // Lấy các ID cần thiết từ dữ liệu hiện tại
      const examId = exam.id; // ID của bài thi (exam)
      const questionId = editingQuestion.id; // ID của câu hỏi (question)
      const answerId = editingQuestion.answers[0]?.id; // ID của câu trả lời (answer)

      // 1. Payload cho câu hỏi (question)
      const questionPayload = {
        examId: examId, // ID của bài thi
        questionExam: editingQuestion.questionExam, // Nội dung câu hỏi
        point: editingQuestion.point, // Điểm của câu hỏi
      };

      // Gọi API để cập nhật câu hỏi
      await axios.put(
        `http://46.202.178.139:5050/api/v1/questions/update/${questionId}`,
        questionPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2. Payload cho câu trả lời (answers)
      const answerPayload = {
        questionId: questionId, // ID của câu hỏi liên quan
        examId: examId, // ID của bài thi liên quan
        answer1: editingQuestion.answers[0]?.answer1 || "",
        answer2: editingQuestion.answers[0]?.answer2 || "",
        answer3: editingQuestion.answers[0]?.answer3 || "",
        answer4: editingQuestion.answers[0]?.answer4 || "",
        correctAnswer: editingQuestion.answers[0]?.correctAnswer || "",
      };

      // Gọi API để cập nhật câu trả lời
      await axios.put(
        `http://46.202.178.139:5050/api/v1/answers/update/${answerId}`,
        answerPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Hiển thị thông báo thành công
      setAlertType("success");
      setAlertDescription("Question and answers updated successfully!");
      setAlertVisible(true);

      // Cập nhật lại danh sách câu hỏi trong giao diện
      const updatedQuestions = exam.question.map((q) =>
        q.id === questionId ? { ...q, ...editingQuestion } : q
      );
      setExam({ ...exam, question: updatedQuestions });

      // Đóng popup
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating question or answers:", error);
      setAlertType("error");
      setAlertDescription("Failed to update question or answers.");
      setAlertVisible(true);
    } finally {
      setIsEditingLoading(false); // Kết thúc loading
    }
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    setEditingQuestion(null);
  };
  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = Cookies.get("token");

      // Gọi API để xóa câu hỏi
      await axios.delete(
        `http://46.202.178.139:5050/api/v1/questions/delete/${questionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Hiển thị thông báo thành công
      setAlertType("success");
      setAlertDescription("Question deleted successfully!");
      setAlertVisible(true);

      // Cập nhật danh sách câu hỏi
      const updatedQuestions = exam.question.filter((q) => q.id !== questionId);
      setExam({ ...exam, question: updatedQuestions });
    } catch (error) {
      console.error("Error deleting question:", error);
      setAlertType("error");
      setAlertDescription("Failed to delete question.");
      setAlertVisible(true);
    }
  };

  const toggleQuestionDetails = (questionId) => {
    setExpandedQuestions((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!exam) {
    return <p>No exam found.</p>;
  }

  return (
    <div className="detail-exam-container">
      <GlobalAlert
        setVisible={setAlertVisible}
        visible={alertVisible}
        type={alertType}
        description={alertDescription}
      />

      {/* Left Section */}
      <div className="detail-left-section">
        <h2>Edit Exam</h2>
        <form className="detail-exam-form">
          <div className="detail-exam-group">
            <label
              onClick={() => setShowTitleInput(!showTitleInput)}
              className={`dropdown-label ${showTitleInput ? "active" : ""}`}
            >
              Exam Title <AiOutlineDown />
            </label>
            {showTitleInput && (
              <input
                type="text"
                value={exam.title}
                onChange={(e) => setExam({ ...exam, title: e.target.value })}
                className="dropdown-input"
              />
            )}
          </div>
          <div className="detail-exam-group">
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
                value={exam.description}
                onChange={(e) =>
                  setExam({ ...exam, description: e.target.value })
                }
                className="dropdown-input"
              />
            )}
          </div>
          <div className="detail-exam-group">
            <label
              onClick={() => setShowDurationInput(!showDurationInput)}
              className={`dropdown-label ${showDurationInput ? "active" : ""}`}
            >
              Exam Duration <AiOutlineDown />
            </label>
            {showDurationInput && (
              <input
                type="number"
                value={exam.duration}
                onChange={(e) =>
                  setExam({ ...exam, duration: parseInt(e.target.value, 10) })
                }
                className="dropdown-input"
              />
            )}
          </div>
          <div className="detail-exam-group">
            <label
              onClick={() =>
                setShowCandidatePositionDropdown(!showCandidatePositionDropdown)
              }
              className={`dropdown-label ${
                showCandidatePositionDropdown ? "active" : ""
              }`}
            >
              Candidate Position <AiOutlineDown />
            </label>
            {showCandidatePositionDropdown && (
              <select
                value={exam.candidatePositionId || ""} // Hiển thị giá trị mặc định
                onChange={(e) =>
                  setExam({
                    ...exam,
                    candidatePositionId: parseInt(e.target.value, 10),
                  })
                }
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

          <button
            onClick={handleUpdateExam}
            type="button"
            className="submit-btn detail-update-exam-btn"
          >
            Update Exam
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="detail-right-section">
  <h2>Manage Questions and Answers</h2>

  {/* Danh sách câu hỏi hiện tại và mới thêm */}
  <div className="detail-question-list">
  {/* Các câu hỏi cũ */}
  {exam.question.map((q, qIndex) => (
    <div key={q.id} className="detail-question-group">
      <div
        className="detail-question-header"
        onClick={() => toggleQuestionDetails(q.id)}
      >
        <span>
          {qIndex + 1}. {q.questionExam}
        </span>
        <div className="detail-question-actions">
          <MdEdit
            className="edit-icon"
            title="Edit Question"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
              handleEditQuestion(q.id);
            }}
          />
          <MdDelete
            className="delete-icon"
            title="Delete Question"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
              handleDeleteQuestion(q.id);
            }}
          />
        </div>
        <AiOutlineDown
          className={`dropdown-icon ${
            expandedQuestions[q.id] ? "open" : ""
          }`}
        />
      </div>

      {expandedQuestions[q.id] && (
        <div className="detail-question-details">
          <span className="question-point">Point: {q.point}</span>
          <p>Answer 1: {q.answers[0]?.answer1 || "N/A"}</p>
          <p>Answer 2: {q.answers[0]?.answer2 || "N/A"}</p>
          <p>Answer 3: {q.answers[0]?.answer3 || "N/A"}</p>
          <p>Answer 4: {q.answers[0]?.answer4 || "N/A"}</p>
          <p>
            <strong>Correct Answer:</strong>{" "}
            {q.answers[0]?.correctAnswer || "N/A"}
          </p>
        </div>
      )}
    </div>
  ))}

  {/* Các câu hỏi mới */}
  {newQuestions.map((q, index) => (
    <div key={`new-${index}`} className="detail-question-group">
      <div
        className="detail-question-header"
        onClick={() => toggleQuestionDetails(`new-${index}`)}
      >
        <span>
          {exam.question.length + index + 1}. New Question
        </span>
        <AiOutlineDown
          className={`dropdown-icon ${
            expandedQuestions[`new-${index}`] ? "open" : ""
          }`}
        />
      </div>

      {expandedQuestions[`new-${index}`] && (
        <div className="detail-question-details">
          <label>Question:</label>
          <input
            type="text"
            placeholder="Enter question text"
            value={q.questionExam}
            onChange={(e) =>
              handleQuestionChange(index, "questionExam", e.target.value)
            }
          />

          <label>Point:</label>
          <input
            type="number"
            placeholder="Enter point"
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

          <label>Correct Answer (1-4):</label>
          <input
            type="number"
            placeholder="Enter correct answer number"
            value={q.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(index, "correctAnswer", e.target.value)
            }
          />
        </div>
      )}
    </div>
  ))}
</div>


  {/* Nút thêm câu hỏi mới */}
  <div className="button-group">
  <button onClick={handleAddQuestion} className="add-question-btn">
    <GoPlus /> Add Question
  </button>
  <button onClick={handleCreateQuestions} className="save-questions-btn">
    Save
  </button>
</div>
</div>



      {/* Edit Popup */}
      {showEditPopup && (
        <>
          {/* Overlay */}
          <div className="edit-popup-overlay" onClick={handleClosePopup}></div>

          {/* Popup */}
          <div className="edit-popup">
            <div className="popup-content1">
              {/* Close Button */}
              <button
                type="button"
                className="close-btn"
                onClick={handleClosePopup}
              >
                &times;
              </button>

              <h3>Edit Question and Answers</h3>
              <form>
                {/* Question Input */}
                <div>
                  <label>Question:</label>
                  <input
                    type="text"
                    value={editingQuestion?.questionExam || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        questionExam: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Point Input */}
                <div>
                  <label>Point:</label>
                  <input
                    type="number"
                    value={editingQuestion?.point || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        point: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>

                {/* Answer Inputs */}
                {[1, 2, 3, 4].map((num) => (
                  <div key={num}>
                    <label>Answer {num}:</label>
                    <input
                      type="text"
                      value={
                        editingQuestion?.answers[0]?.[`answer${num}`] || ""
                      }
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          answers: [
                            {
                              ...editingQuestion.answers[0],
                              [`answer${num}`]: e.target.value,
                            },
                          ],
                        })
                      }
                    />
                  </div>
                ))}

                <div>
                  <label>Correct Answer:</label>
                  <input
                    type="number"
                    value={editingQuestion?.answers[0]?.correctAnswer || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        answers: [
                          {
                            ...editingQuestion.answers[0],
                            correctAnswer: parseInt(e.target.value, 10),
                          },
                        ],
                      })
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleSaveEdit}
                    disabled={isEditingLoading} // Vô hiệu hoá nút khi loading

                  >
                      {isEditingLoading ? <Spin size="small" /> : "Save"}

                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailExam;
