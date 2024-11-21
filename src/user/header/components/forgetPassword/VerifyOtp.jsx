import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useLocation } from "react-router-dom";
import userApi from "../../../../api/userApi/UserApi";

const VerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email || ""; 

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.post("/checkotp", {
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      message.success(response.data?.message || "Password reset successfully!");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <Form
        name="verify-otp"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ email }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Enter your email" disabled />
        </Form.Item>
        <Form.Item
          label="OTP"
          name="otp"
          rules={[{ required: true, message: "Please input your OTP!" }]}
        >
          <Input placeholder="Enter your OTP" />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password placeholder="Enter your new password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOtp;
