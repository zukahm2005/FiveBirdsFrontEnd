import React, { useEffect, useState } from "react";
import {Table, Button, Space, Spin, message, Form, Modal, Input} from "antd";
import { apiService } from "../service/api";
import {MdDelete} from "react-icons/md";
import {GrView} from "react-icons/gr";

const ListPositions = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllPosition();
            setPositions(response.data);
            setLoading(false);
        } catch (error) {
            message.error("Failed to fetch positions.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const deletePosition = (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this position?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await apiService.deletePosition(id);
                    message.success("Position deleted successfully.");
                    fetchPositions();
                } catch (error) {
                    message.error("Failed to delete position.");
                }
            },
        });
    };

    const openUpdateModal = (position) => {
        setSelectedPosition(position);
        setIsUpdateModalVisible(true);
    };

    const closeUpdateModal = () => {
        setSelectedPosition(null);
        setIsUpdateModalVisible(false);
    };

    const updatePosition = async (values) => {
        try {
            await apiService.updatePosition(selectedPosition.id, values);
            message.success("Position updated successfully.");
            fetchPositions();
            closeUpdateModal();
        } catch (error) {
            message.error("Failed to update position.");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => openUpdateModal(record)}
                        icon={<GrView />}
                    >
                        Update
                    </Button>
                    <Button type="primary" danger onClick={() => deletePosition(record.id)}
                            icon={<MdDelete />}>
                        Delete
                    </Button>
                </Space>
            ),
        }

    ];

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <h2>List of Positions</h2>
            <Table columns={columns} dataSource={positions} rowKey="id" />

            {/* Update Modal */}
            <Modal
                title="Update Position"
                visible={isUpdateModalVisible}
                onCancel={closeUpdateModal}
                footer={null}
            >
                <Form
                    layout="vertical"
                    initialValues={selectedPosition}
                    onFinish={updatePosition}
                >
                    <Form.Item
                        label="Position Name"
                        name="name"
                        rules={[{ required: true, message: "Please input the position name!" }]}
                    >
                        <Input placeholder="Enter position name" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ListPositions;
