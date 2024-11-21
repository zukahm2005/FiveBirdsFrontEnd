import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import userApi from "../../../../api/userApi/UserApi";
import "./forgetPassword.scss";

const ForgotPassword = ({ onOtpSent }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.post("/forgot", {
        email: values.email,
      });

      message.success(response.data?.message || "An OTP has been sent to your email!");
      onOtpSent(values.email); 
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <Form name="forgot-password" layout="vertical" onFinish={onFinish}>
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
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
