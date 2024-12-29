import React, { useState } from "react";
import "./createtest.scss";

const CreateTest = () => {
  // States cho từng trường
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [title, setTitle] = useState("");

  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [description, setDescription] = useState("");

  const [showDurationInput, setShowDurationInput] = useState(false);
  const [duration, setDuration] = useState("");

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Duration:", duration);
    alert(`Submitted:\nTitle: ${title}\nDescription: ${description}\nDuration: ${duration}`);

    // Ẩn tất cả các input sau khi submit
    setShowTitleInput(false);
    setShowDescriptionInput(false);
    setShowDurationInput(false);
  };

  return (
    <div className="create-test-container">
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label onClick={() => setShowTitleInput(!showTitleInput)} className="dropdown-label">
              Title
            </label>
            {showTitleInput && (
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="dropdown-input"
              />
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label onClick={() => setShowDescriptionInput(!showDescriptionInput)} className="dropdown-label">
              Description
            </label>
            {showDescriptionInput && (
              <input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="dropdown-input"
              />
            )}
          </div>

          {/* Duration */}
          <div className="form-group">
            <label onClick={() => setShowDurationInput(!showDurationInput)} className="dropdown-label">
              Duration
            </label>
            {showDurationInput && (
              <input
                type="text"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="dropdown-input"
              />
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;
