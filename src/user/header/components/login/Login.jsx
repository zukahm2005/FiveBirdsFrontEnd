import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../api/userApi/UserApi";
import SpinWrapper from "../../../../common/spin/SpinWrapper";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    const startTime = Date.now();
    try {
      const payload = {
        Username: values.username,
        Password: values.password,
      };

      const response = await userApi.post("/login", payload);
      const apiEndTime = Date.now();

      if (response.status === 200) {
        const apiDuration = apiEndTime - startTime;
        const additionalTasksTime = 500;
        const totalDuration = apiDuration + additionalTasksTime;

        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, additionalTasksTime);
        message.success(response.data.message);
      } else {
        message.error("Failed to login!");
        setLoading(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed! Please check your credentials.";
      message.error(errorMessage);

      setLoading(false);
    }
  };

  return (
    <SpinWrapper loading={loading} tip="Logging in...">
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

            <Button type="link" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Button>
          </Form.Item>
        </Form>
      </div>
    </SpinWrapper>
  );
};

export default Login;
