import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Modal, Input, Button } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { GrView } from "react-icons/gr";
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
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Hiển thị popup thêm admin
  const [newAdminValues, setNewAdminValues] = useState({
    userName: "",
    email: "",
    password: "",
  }); // Lưu giá trị form thêm admin

  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Hiển thị popup
  const [selectedUser, setSelectedUser] = useState(null); // Lưu thông tin user đang chỉnh sửa
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  }); // Lưu giá trị form

  const token = Cookies.get("token");

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1, // index bắt đầu từ 0, nên cộng 1
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
      title: "Action",
      key: "action",
      render: (_, record) => (
          <Space size="middle">
            <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#1890ff",
                }}
                title="Edit"
                onClick={() => handleEdit(record)}
            >
              <MdEdit size={20}/>
            </button>
            <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "red",
                }}
                title="Delete"
                onClick={() => handleDelete(record.key)}
            >
              <MdDelete size={20}/>
            </button>
          </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
            `http://46.202.178.139:5050/api/v1/users/get-admin/all?pageNumber=${pagination.current}&pageSize=${pagination.pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const transformedData = response.data.data.map((item) => ({
          key: item.userId, // Khóa duy nhất cho từng hàng
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
          await axios.delete(
              `http://46.202.178.139:5050/api/v1/users/delete/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
          );
          setAlertType("success");
          setAlertDescription("Admin deleted successfully!");
          setAlertVisible(true);
          setData((prevData) => prevData.filter((item) => item.key !== id));
        } catch (error) {
          setAlertType("error");
          setAlertDescription("Failed to delete admin.");
          setAlertVisible(true);
          console.error(
              "Error deleting admin:",
              error.response ? error.response.data : error.message
          );
        }
      },
    });
  };


  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current || 1, // Đảm bảo current là số
      pageSize: pagination.pageSize || 10, // Đảm bảo pageSize là số
    });
  };

  const handleEdit = (record) => {
    // Mở popup và đặt giá trị form

    setSelectedUser(record);
    setFormValues({
      userName: record?.user?.userName || "",
      password: "", // Password không được lưu trước
    });
    setIsEditModalVisible(true);
  };
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setNewAdminValues({ ...newAdminValues, [name]: value });
  };
  
  const handleAddAdmin = async () => {
    try {
      // Gọi API để thêm admin
      await axios.post(
        `http://46.202.178.139:5050/api/v1/users/register-admin`,
        newAdminValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Hiển thị thông báo thành công
      setAlertType("success");
      setAlertDescription("Admin added successfully!");
      setAlertVisible(true);
  
      // Đóng modal và reset form
      setIsAddModalVisible(false);
      setNewAdminValues({
        userName: "",
        email: "",
        password: "",
      });
  
      // Reload danh sách admin
      setPagination({ ...pagination }); // Tự động fetch lại dữ liệu
    } catch (error) {
      // Hiển thị thông báo lỗi
      setAlertType("error");
      setAlertDescription("Failed to add admin.");
      setAlertVisible(true);
      console.error("Error adding admin:", error.response ? error.response.data : error.message);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Sử dụng email từ selectedUser nếu không thay đổi
      const payload = {
        userName: formValues.userName || selectedUser.user.userName,
        password: formValues.password,       // Mật khẩu hiện tại
        newPassword: formValues.newPassword, // Mật khẩu mới        // Mật khẩu mới
        email: selectedUser.user.email, 
      };
  
      console.log("Payload gửi đi:", payload); // Log payload để kiểm tra
  
      await axios.put(
        `http://46.202.178.139:5050/api/v1/users/update/${selectedUser.key}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setAlertType("success");
      setAlertDescription("User updated successfully!");
      setAlertVisible(true);
  
      // Reload dữ liệu
      setPagination({ ...pagination });
    } catch (error) {
      setAlertType("error");
      setAlertDescription("Failed to update user.");
      setAlertVisible(true);
      console.error(
        "Error updating user:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsEditModalVisible(false); // Đóng modal
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
          <button className="button-add-admin" onClick={() => setIsAddModalVisible(true)}>
            <GoPlus /> Add Admin
          </button>
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
            y: 530, // Chiều cao cố định của nội dung bảng
          }}
          onChange={handleTableChange}
        />
      </div>
      //popup add
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
      {/* Popup chỉnh sửa */}
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
