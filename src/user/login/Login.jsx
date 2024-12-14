import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Xử lý validation
    if (!formValues.username) {
      newErrors.username = "Please input your username!";
    } else if (formValues.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters!";
    }

    if (!formValues.password) {
      newErrors.password = "Please input your password!";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Giả lập gọi API login
    setTimeout(() => {
      setLoading(false);
      if (formValues.username === "admin" && formValues.password === "123456") {
        navigate("/home");
      } else {
        alert("Invalid credentials");
      }
    }, 1000);
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
