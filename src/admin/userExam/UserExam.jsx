import React, { useEffect, useState } from "react";
import {Space, Table, Modal, Input, Button, message} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { MdDelete, MdEdit } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import dayjs from "dayjs";
import GlobalAlert from "../../common/globalAlert/GlobalAlert";
import "./userexam.scss";

const UserExam = () => {
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newAdminValues, setNewAdminValues] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  });

  const token = Cookies.get("token");

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: ["user", "userName"],
      key: "userName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Create Date",
      dataIndex: "examTime",
      key: "examTime",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Update Date",
      dataIndex: "examDate",
      key: "examDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
          <Space>
            <Button
                type="link"
                onClick={() => handleEdit(record)}
                icon={<MdEdit />}
            />
            <Button type="link" danger onClick={() => handleDelete(record.key)}
                    icon={<MdDelete />}/>
          </Space>
      ),
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
            `http://localhost:5005/api/v1/users/get-admin/all?pageNumber=${pagination.current}&pageSize=${pagination.pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const transformedData = response.data.data.map((item) => ({
          key: item.userId,
          user: {
            userName: item.userName,
            email: item.email,
          },
          examTime: item.create_at,
          examDate: item.update_at,
        }));

        console.log("Transformed Data:", transformedData);
        setData(transformedData);
      } catch (error) {
        console.error(
          "Error fetching admin data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination]);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this admin? This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await axios.delete(
              `http://localhost:5005/api/v1/users/delete/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
          );

          if (response.status === 200 || response.status === 204) {
            message.success("Admin deleted successfully!");
            setData((prevData) => prevData.filter((item) => item.key !== id));
          } else {
            message.error("Failed to delete admin. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting admin:", error);
          message.error("Failed to delete admin.");
        }
      },
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
  };

  const handleEdit = (record) => {

    setSelectedUser(record);
    setFormValues({
      userName: record?.user?.userName || "",
      password: "",
    });
    setIsEditModalVisible(true);
  };
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setNewAdminValues({ ...newAdminValues, [name]: value });
  };
  
  const handleAddAdmin = async () => {
    try {
      await axios.post(
        `http://localhost:5005/api/v1/users/register-admin`,
        newAdminValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Admin added successfully!")
  

      setIsAddModalVisible(false);
      setNewAdminValues({
        userName: "",
        email: "",
        password: "",
      });
  
      setPagination({ ...pagination });
    } catch (error) {
      message.error("Failed to add admin.")
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        userName: formValues.userName || selectedUser.user.userName,
        password: formValues.password,
        newPassword: formValues.newPassword,
        email: selectedUser.user.email, 
      };
  
      await axios.put(
        `http://localhost:5005/api/v1/users/update/${selectedUser.key}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      message.success("User updated successfully!")
  
      setPagination({ ...pagination });
    } catch (error) {
      message.error("Failed to update user.")
    } finally {
      setIsEditModalVisible(false);
    }
  };
    
  return (
    <div className="list-admin">
      <GlobalAlert
        setVisible={setAlertVisible}
        visible={alertVisible}
        type={alertType}
        description={alertDescription}
      />

      <h1>Admin List</h1>
      <div className="admin-header">
          <Button type="primary"
                  onClick={() => setIsAddModalVisible(true)}
                  className="add-admin-button"
                  style={{
                    backgroundColor: "#4e78f5",
                    borderColor: "#4CAF50",
                    float: "right",
                  marginBottom: "20px"}}>
            <GoPlus /> Add Admin
          </Button>
      </div>

      <div className="admin-container">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          scroll={{
            y: 530,
          }}
          onChange={handleTableChange}
        />
      </div>
      <Modal
  title="Add Admin"
  visible={isAddModalVisible}
  onCancel={() => setIsAddModalVisible(false)}
  onOk={handleAddAdmin}
  okText="Add"
  cancelText="Cancel"
>
  <div>
    <label>User Name:</label>
    <Input
      name="userName"
      value={newAdminValues.userName}
      onChange={handleAddFormChange}
    />
  </div>
  <div style={{ marginTop: 10 }}>
    <label>Email:</label>
    <Input
      name="email"
      value={newAdminValues.email}
      onChange={handleAddFormChange}
    />
  </div>
  <div style={{ marginTop: 10 }}>
    <label>Password:</label>
    <Input
      name="password"
      type="password"
      value={newAdminValues.password}
      onChange={handleAddFormChange}
    />
  </div>
</Modal>
      <Modal
  title="Edit Admin"
  visible={isEditModalVisible}
  onCancel={() => setIsEditModalVisible(false)}
  onOk={handleSave}
  okText="Save"
  cancelText="Cancel"
>
  <div>
    <label>User Name:</label>
    <Input
      name="userName"
      value={formValues.userName}
      onChange={handleFormChange}
    />
  </div>
  <div style={{ marginTop: 10 }}>
    <label>Current Password:</label>
    <Input
      name="password"
      type="password"
      value={formValues.password}
      onChange={handleFormChange}
    />
  </div>
  <div style={{ marginTop: 10 }}>
    <label>New Password:</label>
    <Input
      name="newPassword"
      type="password"
      value={formValues.newPassword}
      onChange={handleFormChange}
    />
  </div>
</Modal>

    </div>
  );
};

export default UserExam;
