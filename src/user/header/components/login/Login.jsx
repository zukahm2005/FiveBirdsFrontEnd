import { Button, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
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
  const handleGoogleLoginSuccess = async (response) => {
    setLoading(true);
    try {
      const { credential } = response;

      const backendResponse = await fetch(
        "http://localhost:5005/api/auth/google/callback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${credential}`,
          },
          credentials: "include", 
        }
      );

      if (backendResponse.status === 200) {
        message.success("Google login successful!");

        const roleResponse = await fetch(
          "http://localhost:5005/api/auth/checkrole",
          {
            method: "GET",
            credentials: "include", 
          }
        );

        if (roleResponse.ok) {
          const roleResult = await roleResponse.json();
          const role = roleResult.role;

          if (role === "ROLE_ADMIN") {
            navigate("/admin");
          } else if (role === "ROLE_USER") {
            navigate("/");
          } else {
            message.error("Invalid role. Access denied.");
          }
        } else {
          message.error("Failed to fetch user role.");
        }
      } else {
        const errorResult = await backendResponse.json();
        const errorMessage = errorResult.message || "Google login failed!";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Google login error:", error);
      message.error("An error occurred during Google login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google Login Failed: ", error);
    if (error.error === "popup_closed_by_user") {
      message.error("Google login canceled by user.");
    } else {
      message.error("Google login failed. Please try again.");
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
              {
                required: true,
                message: "Please input your username!",
              },
              {
                min: 3,
                message: "Username must be at least 3 characters!",
              },
              {
                validator: (_, value) => {
                  if (value && value.trim().length === 0) {
                    return Promise.reject(
                      new Error("Username cannot be empty or only whitespace!")
                    );
                  }
                  if (value && /\s/.test(value)) {
                    return Promise.reject(
                      new Error("Username cannot contain whitespace!")
                    );
                  }
                  return Promise.resolve();
                },
              },
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
        <div className="google-login">
          <GoogleLogin
            clientId="171396104776-o302sm82q27mlmb0spq1tu54r1fvbdgg.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            cookiePolicy={"single_host_origin"}
          />
        </div>
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
