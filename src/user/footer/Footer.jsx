import React, { useEffect, useState } from "react";
import "./footer.scss";
import axios from "axios";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt,FaFacebookF, FaInstagram, FaLinkedin, FaPinterestP } from "react-icons/fa"; // Import icon từ react-icons
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const [footerContent, setFooterContent] = useState({
    column1: "",
    column2: "",
    column3: "",
  });
  const [footerImage, setFooterImage] = useState(""); // State để lưu đường dẫn ảnh

  // Fetch nội dung Footer từ API
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const footerResponse = await axios.get("http://localhost:5005/api/v1/footer");
        if (footerResponse.data) {
          setFooterContent(footerResponse.data); // Set nội dung Footer
        }

        const imageResponse = await axios.get("http://localhost:5005/api/v1/footer-images");
        if (imageResponse.data && imageResponse.data.length > 0) {
          setFooterImage(imageResponse.data[0].imageUrl); // Lưu URL ảnh từ API
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooter();
  }, []);

  // Hàm gán icon cho nội dung động từ API
  const renderContentWithIcons = (content) => {
    // Sử dụng DOMParser để phân tích cú pháp HTML từ API
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(content, "text/html");
    const lines = Array.from(parsedDocument.body.childNodes)
      .map((node) => node.textContent.trim())
      .filter((text) => text !== ""); // Loại bỏ dòng trống hoặc không hợp lệ
  
    // Render nội dung với icon
    return lines.map((line, index) => {
      if (index === 0) {
        // Dòng đầu tiên không có icon
        return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
      }
  
      let icon = null;
  
      // Gán icon tương ứng
      if (line.includes("@")) {
        icon = <FaEnvelope />;
      } else if (line.match(/\d{3}-\d{3}-\d{4}/) || line.match(/\+\d/)) {
        icon = <FaPhoneAlt />;
      } else {
        icon = <FaMapMarkerAlt />;
      }
  
      return (
        <p key={index}>
          {icon} {line}
        </p>
      );
    });
  };
  

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Logo và thông tin liên hệ */}
        <div className="footer-column">
          <div className="footer-image">
            {footerImage && <img src={footerImage} alt="Footer Logo" />}
          </div>
          <div className="footer-contact">
            {renderContentWithIcons(footerContent.column1)} {/* Nội dung động với icon */}
          </div>
        </div>

        {/* Cột 2: Categories */}
        <div className="footer-column">
          <h3>Categories</h3>
          <div dangerouslySetInnerHTML={{ __html: footerContent.column2 }} />
        </div>

        {/* Cột 3: FAQs */}
        <div className="footer-column">
          <h3>FAQs</h3>
          <div dangerouslySetInnerHTML={{ __html: footerContent.column3 }} />
          <div className="footer-social-icons">
            <FaFacebookF className="social-icon" />
            <FaXTwitter className="social-icon" />
            <FaInstagram className="social-icon" />
            <FaLinkedin className="social-icon" />
            <FaPinterestP className="social-icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}
