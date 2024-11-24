import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import giao diện QuillJS
import "./editorcolumn.scss"; // Import file SCSS
import axios from "axios"; // Dùng để gọi API

export default function EditorColumn() {
  const [content1, setContent1] = useState(""); // Nội dung cột 1
  const [content2, setContent2] = useState(""); // Nội dung cột 2
  const [content3, setContent3] = useState(""); // Nội dung cột 3
  const [uploadedImage, setUploadedImage] = useState(null); // URL của ảnh đã upload
  const [selectedImage, setSelectedImage] = useState(null); // File ảnh được chọn

  // Hàm tải dữ liệu Footer từ backend
  const fetchFooterData = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/v1/footer");
      const { column1, column2, column3 } = response.data || {};
      setContent1(column1 || "");
      setContent2(column2 || "");
      setContent3(column3 || "");

      // Gọi API để lấy ảnh Footer
      const imageResponse = await axios.get("http://localhost:5005/api/v1/footer-images");
      if (imageResponse.data && imageResponse.data.length > 0) {
        setUploadedImage(imageResponse.data[0].imageUrl); // Lấy ảnh đầu tiên
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  // Hàm lưu dữ liệu Footer lên backend
  const saveFooterData = async () => {
    try {
      const payload = {
        column1: content1,
        column2: content2,
        column3: content3,
      };
      const response = await axios.post("http://localhost:5005/api/v1/footer/save", payload);
      console.log("Footer saved successfully:", response.data);
      alert("Footer updated successfully!");
    } catch (error) {
      console.error("Error saving footer data:", error);
      alert("Failed to update footer!");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image to upload!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedImage); // Gửi file ảnh
    formData.append("altText", "Footer Image"); // Thêm Alt Text nếu cần
  
    try {
      const response = await axios.post(
        "http://localhost:5005/api/v1/footer-images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setUploadedImage(response.data.imageUrl); // Hiển thị ảnh sau khi upload thành công
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      alert("Failed to upload image!");
    }
  };
  
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Lưu file vào state
    }
  };


  // Tải dữ liệu Footer khi trang được mở
  useEffect(() => {
    fetchFooterData();
  }, []);

  return (
    <div className="editor-container">
      {/* Upload Image */}
      <div className="upload-container">
        <h3>Upload Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="upload-input"
        />
        {uploadedImage && (
          <div className="uploaded-image">
            <h4>Uploaded Image:</h4>
            <img src={uploadedImage} alt="Uploaded" />
          </div>
        )}
        <button className="upload-button" onClick={handleImageUpload}>
          Upload Image
        </button>
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

      {/* Nút Save */}
      <button className="save-button" onClick={saveFooterData}>
        Save Footer
      </button>
    </div>
  );
}
