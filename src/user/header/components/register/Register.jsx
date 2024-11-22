import { Button, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../api/userApi/UserApi";
import SpinWrapper from "../../../../common/spin/SpinWrapper";
import VerifyRegister from "./VerifyRegister";
import "./register.scss";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        UserName: values.name,
        Email: values.email,
        Password: values.password,
      };

      const response = await userApi.post("/register", payload);

      if (response.status === 200 && response.data?.message) {
        message.success(response.data.message);
        setEmail(values.email);
        setIsModalVisible(true);
      } else {
        message.error(response.data?.message || "Something went wrong!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to register user!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpinWrapper loading={loading} tip="Loading...">
      <div className="component-container-details">
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          className="register-form"
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 3, message: "Username must be at least 3 characters!" },
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
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => navigate("/login")}>
              Already have an account? Login here
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        title="Verify Email"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <VerifyRegister email={email} closeModal={() => setIsModalVisible(false)} />
      </Modal>
    </SpinWrapper>
  );
};

export default Register;
