import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { apiService } from "../service/api";

const CreatePosition = ({ fetchPositions }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await apiService.createPosition(values);
            message.success("Position created successfully.");
            fetchPositions();
            setLoading(false);
        } catch (error) {
            message.error("Failed to create position.");
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create Position</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Position Name"
                    name="name"
                    rules={[{ required: true, message: "Please input the position name!" }]}
                >
                    <Input placeholder="Enter position name" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreatePosition;
