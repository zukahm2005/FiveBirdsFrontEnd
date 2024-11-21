import { Button, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../api/userApi/UserApi";
import SpinWrapper from "../../../../common/spin/SpinWrapper";
import ForgotPassword from "../forgetPassword/ForgetPassword";
import VerifyOtp from "../forgetPassword/VerifyOtp";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [modalContent, setModalContent] = useState("forgotPassword");
  const [email, setEmail] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        Username: values.username,
        Password: values.password,
      };

      const response = await userApi.post("/login", payload);

      if (response.status === 200) {
        message.success(response.data.message);

        const token = response.data.token;

        const roleResponse = await userApi.get("/checkrole");
        const role = roleResponse.data.role;

        if (role === "ROLE_ADMIN") {
          navigate("/admin");
        } else if (role === "ROLE_USER") {
          navigate("/");
        } else {
          message.error("Invalid role. Access denied.");
        }
      } else {
        message.error("Failed to login!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed! Please check your credentials.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setModalContent("forgotPassword");
    setForgotPasswordModalVisible(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordModalVisible(false);
  };

  const handleOtpSent = (email) => {
    setEmail(email);
    setModalContent("verifyOtp");
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

            <Button type="link" onClick={handleForgotPasswordClick}>
              Forgot Password?
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title={
            modalContent === "forgotPassword" ? "Forgot Password" : "Verify OTP"
          }
          visible={isForgotPasswordModalVisible}
          onCancel={handleForgotPasswordClose}
          footer={null}
        >
          {modalContent === "forgotPassword" && (
            <ForgotPassword
              onOtpSent={handleOtpSent}
              closeModal={handleForgotPasswordClose}
            />
          )}
          {modalContent === "verifyOtp" && (
            <VerifyOtp email={email} closeModal={handleForgotPasswordClose} />
          )}
        </Modal>
      </div>
    </SpinWrapper>
  );
};

export default Login;
