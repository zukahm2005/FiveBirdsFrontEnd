import { Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import userApi from "../../../../api/userApi/UserApi";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const checkRole = async () => {
    try {
      const response = await userApi.get("/checkrole");
      const role = response.data.role;
      console.log("role:" + role);
      return role;
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Failed to fetch user role",
      });
      return null;
    }
  };

  const fetchUsersWithRoleCheck = async (pageNumber) => {
    setLoading(true);
    try {
      const role = await checkRole(); // Lấy role từ API checkrole

      if (role !== "ROLE_ADMIN") {
        notification.error({
          message: "Access Denied",
          description: "You do not have permission to view this page.",
        });
        return;
      }

      // Nếu role là ROLE_ADMIN, gọi API lấy danh sách user
      const response = await userApi.get(`/all/${pageNumber}`);
      const data = response.data.data;

      setUsers(data);
      setPagination({
        ...pagination,
        current: pageNumber,
        total: response.data.totalCount || 50,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to fetch users",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsersWithRoleCheck(pagination.current); // Kiểm tra role trước khi lấy danh sách user
  }, []);

  const handleTableChange = (pagination) => {
    fetchUsersWithRoleCheck(pagination.current);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Created At",
      dataIndex: "create_at",
      key: "create_at",
    },
    {
      title: "Updated At",
      dataIndex: "update_at",
      key: "update_at",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey={(record) => record.userId}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default ListUser;
