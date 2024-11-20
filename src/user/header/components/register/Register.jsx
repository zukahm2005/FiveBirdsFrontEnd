import React from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import userApi from '../../../../api/userApi/UserApi';
import { message } from "antd";
import "./register.scss";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const payload = {
        UserName: values.name,
        Email: values.email,
        Password: values.password,
      };
  
      const response = await userApi.post("/register", payload);
  
      if (response.status === 200 && response.data?.message) {
        message.success(response.data.message);
        navigate("/login");
      } else {
        message.error(response.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error registering user:", error);
  
      const errorMessage = error.response?.data?.message || "Failed to register user!";
      message.error(errorMessage);
    }
  };
  
  
  
  return (
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
          rules={[{ required: true, message: "Please input your username!" }]}
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
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="link"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login here
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;