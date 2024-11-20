import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../api/userApi/UserApi";
import SpinWrapper from "../../../../common/spin/SpinWrapper";
import "./register.scss";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    const startTime = Date.now(); 
    try {
      const payload = {
        UserName: values.name,
        Email: values.email,
        Password: values.password,
      };

      const response = await userApi.post("/register", payload);
      const apiEndTime = Date.now(); 

      if (response.status === 200 && response.data?.message) {
        const apiDuration = apiEndTime - startTime;
        const additionalTasksTime = 500; 
        const totalDuration = apiDuration + additionalTasksTime;

        console.log(`API call duration: ${apiDuration}ms`);
        console.log(`Total duration (API + tasks): ${totalDuration}ms`);

        setTimeout(() => {
          navigate("/login");
          setLoading(false);
        }, additionalTasksTime);

        message.success(response.data.message);
      } else {
        message.error(response.data?.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error registering user:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to register user!";
      message.error(errorMessage);
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
    </SpinWrapper>
  );
};

export default Register;
