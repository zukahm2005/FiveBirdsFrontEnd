import { Input, Table, notification } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import userApi from "../../../../api/userApi/UserApi";
import "./listUser.scss";
const { Search } = Input;

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const checkRole = async () => {
    try {
      const response = await userApi.get("/checkrole");
      const role = response.data.role;
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
      const role = await checkRole();
      if (role !== "ROLE_ADMIN") {
        notification.error({
          message: "Access Denied",
          description: "You do not have permission to view this page.",
        });
        return;
      }
      const response = await userApi.get(`/all/${pageNumber}`);
      const data = response.data.data;

      setUsers(data);
      setFilteredUsers(data);
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

  const applyFilters = () => {
    const filtered = users.filter((user) => {
      const searchValue = searchText.toLowerCase();
      return (
        user.userId.toString().includes(searchValue) ||
        user.userName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.role.toLowerCase().includes(searchValue) ||
        moment(user.create_at)
          .format("YYYY-MM-DD HH:mm")
          .includes(searchValue) ||
        moment(user.update_at).format("YYYY-MM-DD HH:mm").includes(searchValue)
      );
    });
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsersWithRoleCheck(pagination.current);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText]);

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
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Updated At",
      dataIndex: "update_at",
      key: "update_at",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="list-admin_header">
        <div className="title">
          <h1>List User</h1>
        </div>
        <div className="search">
          <Search
            placeholder="Search anything..."
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey={(record) => record.userId}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ListUser;
