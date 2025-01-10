import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Modal, Input, Button } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { GrView } from "react-icons/gr";
import { MdDelete, MdEdit } from "react-icons/md";
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Hiển thị popup
  const [selectedUser, setSelectedUser] = useState(null); // Lưu thông tin user đang chỉnh sửa
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  }); // Lưu giá trị form

  const token = Cookies.get("token");

  const columns = [
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
      title: "Test Status",
      dataIndex: "testStatus",
      key: "testStatus",
      render: (status) => {
        let color = status === "PENDING" ? "volcano" : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Create Date",
      dataIndex: "examTime",
      key: "examTime",
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
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                }}
                title="View"
            >
                <GrView size={20} />
            </button>

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
            <MdEdit size={20} />
          </button>
          <button
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'red',
                }}
                title="Delete"
                onClick={() => handleDelete(record.id)}
            >
                <MdDelete size={20} />
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
          `http://46.202.178.139:5050/api/v1/user-exam/get/all?pageNumber=${pagination.current}&pageSize=${pagination.pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination]);

  const handleTableChange = (page) => {
    setPagination({
      ...pagination,
      current: page,
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async () => {
    // Gọi API để cập nhật
    try {
      await axios.put(
        `http://46.202.178.139:5050/api/v1/user-exam/update/${selectedUser.id}`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

      {/* Popup chỉnh sửa */}
      <Modal
        title="Edit User"
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
          <label>Password:</label>
          <Input
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleFormChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserExam;
