import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import userApi from "../../../../api/userApi/UserApi";
// import "./forgotpassword.scss";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.post("/forgot-password", {
        email: values.email,
      });

      message.success(response.data?.message || "Reset password email sent!");
    } catch (error) {
      console.error("Forgot password error:", error);
      message.error(
        error.response?.data?.message || "Failed to send reset password email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container-details">
      <h2>Forgot Password</h2>
      <Form
        name="forgot-password"
        layout="vertical"
        onFinish={onFinish}
        className="forgot-password-form"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
