import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../api/userApi/UserApi";

const VerifyRegister = ({ email, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook điều hướng

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.post("/verifyemail", {
        email: email,
        otp: values.otp,
      });

      if (response.status === 200) {
        message.success(response.data?.message || "Email verified successfully!");
        closeModal();
        navigate("/login");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-register-container">
      <Form name="verify-email" layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email">
          <Input value={email} disabled />
        </Form.Item>
        <Form.Item
          label="OTP"
          name="otp"
          rules={[{ required: true, message: "Please input your OTP!" }]}
        >
          <Input placeholder="Enter your OTP" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Verify
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyRegister;
