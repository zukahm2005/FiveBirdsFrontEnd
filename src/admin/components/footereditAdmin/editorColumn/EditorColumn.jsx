import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import giao diện QuillJS
import "./editorcolumn.scss"; // Import file SCSS

export default function EditorColumn() {
  const [content1, setContent1] = useState(""); // Nội dung cột 1
  const [content2, setContent2] = useState(""); // Nội dung cột 2
  const [content3, setContent3] = useState(""); // Nội dung cột 3
  const [uploadedImage, setUploadedImage] = useState(null); // Quản lý ảnh upload

  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Lấy file ảnh từ input
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Tạo URL cho ảnh
      setUploadedImage(imageUrl); // Lưu ảnh vào state
    }
  };

  return (
    <div className="editor-container">
      {/* Upload Image */}
      <div className="upload-container">
        <h3>Upload Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="upload-input"
        />
        {uploadedImage && (
          <div className="uploaded-image">
            <h4>Uploaded Image:</h4>
            <img src={uploadedImage} alt="Uploaded" />
          </div>
        )}
      </div>

      {/* 3 Cột Editor */}
      <div className="editors">
        <div className="editor-column">
          <h3>Editor Column 1</h3>
          <ReactQuill
            theme="snow"
            value={content1}
            onChange={setContent1}
            placeholder="Type something here..."
          />
        </div>
        <div className="editor-column">
          <h3>Editor Column 2</h3>
          <ReactQuill
            theme="snow"
            value={content2}
            onChange={setContent2}
            placeholder="Type something here..."
          />
        </div>
        <div className="editor-column">
          <h3>Editor Column 3</h3>
          <ReactQuill
            theme="snow"
            value={content3}
            onChange={setContent3}
            placeholder="Type something here..."
          />
        </div>
      </div>
    </div>
  );
}
