import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../api/userApi/UserApi";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const payload = {
        Username: values.username,
        Password: values.password,
      };

      const response = await userApi.post("/login", payload);

      if (response.status === 200) {
        message.success(response.data.message);
        navigate("/dashboard");
      } else {
        message.error("Failed to login!");
      }
    } catch (error) {
      console.error("Error logging in:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Login failed! Please check your credentials.";
      message.error(errorMessage);
    }
  };

  return (
    <div className="component-container-details">
      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        className="login-form"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please input your username!" },
            { min: 3, message: "Username must be at least 3 characters!" },
          ]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate("/register")}>
            Don't have an account? Register here
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
