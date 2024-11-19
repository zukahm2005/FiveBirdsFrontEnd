import React from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Login values:", values);
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
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="link"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register here
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
