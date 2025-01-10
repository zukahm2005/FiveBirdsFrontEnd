import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Thư viện js-cookie
import "./loginadmin.scss";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Xóa lỗi khi nhập
  };

  // Hàm gọi API login
  const handleLogin = async () => {
    const response = await fetch("http://46.202.178.139:5050/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: formValues.username,
        password: formValues.password,
      }),
    });

    return response.json(); // Trả về dữ liệu JSON
  };

  // Hàm gọi API checkrole
  const checkRole = async (token) => {
    // const response = await fetch("http://46.202.178.139:5050/api/v1/users/checkrole", {
    const response = await fetch("http://localhost:5005/api/v1/users/checkrole", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
      // Gửi token trong header
      credentials: "include", // Đảm bảo cookie được gửi
    });
    return response.json(); // Trả về dữ liệu JSON
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xử lý validation
    const newErrors = {};
    if (!formValues.username) newErrors.username = "Please input your username!";
    if (!formValues.password) newErrors.password = "Please input your password!";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Gọi API login
      const loginData = await handleLogin();

      if (loginData.errorCode === 200 && loginData.data) {
        const token = loginData.data;

        // Lưu token vào cookie
        Cookies.set("token", token, { expires: 7, secure: false, path: "/" });

        // Gọi API checkrole
        const roleData = await checkRole(Cookies.get("token"));

        if (roleData.role === "ROLE_ADMIN") {
          navigate("/admin"); // Chuyển hướng vào trang admin
        } else {
          alert("Access Denied: You are not an admin!");
        }
      } else {
        alert("Login failed: Invalid credentials!");
        Cookies.remove("token"); // Xóa token trong trường hợp đăng nhập thất bại
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login. Please try again!");
      Cookies.remove("token"); // Xóa token trong trường hợp có lỗi
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username *"
              value={formValues.username}
              onChange={handleInputChange}
              className={`custom-input ${errors.username ? "error" : ""}`}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formValues.password}
              onChange={handleInputChange}
              className={`custom-input ${errors.password ? "error" : ""}`}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="custom-button" disabled={loading}>
            {loading ? "Loading..." : "LOG IN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
