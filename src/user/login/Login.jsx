import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear lỗi khi người dùng nhập
  };

  // Hàm gọi API login
  const handleLogin = async () => {
    const response = await fetch("http://46.202.178.139:5050/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userName: formValues.username,
        password: formValues.password,
      }),
    });

    return response.json(); // Trả về dữ liệu JSON
  };

  // Hàm gọi API checkrole
  const checkRole = async (token) => {
    const response = await fetch("http://46.202.178.139:5050/api/v1/users/checkrole", {
      method: "GET",
      credentials: "include", // Đảm bảo cookie được gửi
    });

    return response.json(); // Trả về dữ liệu JSON
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    // Validation
    if (!formValues.username) {
      newErrors.username = "Please input your username!";
    } else if (formValues.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters!";
    }

    if (!formValues.password) {
      newErrors.password = "Please input your password!";
    } else if (formValues.password.length < 1) {
      newErrors.password = "Password must be at least 6 characters!";
    }

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
        const roleData = await checkRole(token);

        if (roleData.role === "ROLE_CANDIDATE") {
          navigate("/exam"); // Chuyển hướng đến trang ứng viên
        } else {
          alert("Access Denied: Only candidates are allowed!");
          Cookies.remove("token"); // Xóa token nếu không phải ứng viên
        }
      } else {
        alert("Login failed: Invalid credentials!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login. Please try again!");
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

          <div className="link-group">
            <span onClick={() => alert("Forgot Password?")} className="custom-link">
              Forgot Password?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
