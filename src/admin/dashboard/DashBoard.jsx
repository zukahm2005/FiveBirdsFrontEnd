import React, { useState } from "react";
import img from "../../common/img/image.png"
import './dashboard.scss';
import { RxDashboard } from "react-icons/rx";
import { AiOutlineFileText } from "react-icons/ai";


import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  UserOutlined,
  AppstoreOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Header, Sider, Content } = Layout;

const DashBoard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Theme customization
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    // Xóa token khỏi cookie
    Cookies.remove("token");

    // Chuyển hướng về trang login
    navigate("/admin/login");
  };

  return (
    <Layout style={{ height: "100vh" }}>
     <Sider
  trigger={null}
  collapsible
  collapsed={collapsed}
  collapsedWidth={80} // Chiều rộng khi thu nhỏ
  width={300} // Chiều rộng khi mở rộng
  style={{
    height: "100vh", // Full chiều cao
    transition: "all 0.3s ease", // Hiệu ứng mượt
    backgroundColor: "#001529", // Màu nền
  }}
>
  {/* Nội dung Logo */}
  <div className="logo-container">
    <div className="img-logo">
      <img
        src={img}
        alt="Logo"
        style={{
          width: collapsed ? "40px" : "80px", // Logo thay đổi kích thước
          transition: "all 0.3s ease",
        }}
      />
    </div>
    {!collapsed && (
      <div className="content-logo">
        <div className="top-content">
          <p>nafta</p>
        </div>
        <div className="bottom-content">
          <p>OIL & GAS INDUSTRY</p>
        </div>
      </div>
    )}
  </div>

  {/* Menu */}
  <Menu
    theme="dark"
    mode="inline"
    defaultSelectedKeys={["1"]}
    style={{

      width: "90%",
      fontSize: "14px", // Giảm kích thước font
      lineHeight: "1.5", // Giảm khoảng cách dòng
    }}
    items={[
      { key: "1", icon: <AppstoreOutlined style={{ fontSize: "16px" }} />, label: "DashBoard" },
      { key: "2", icon: <FileTextOutlined style={{ fontSize: "16px" }} />, label: "Test" },
      { key: "3", icon: <UserOutlined style={{ fontSize: "16px" }} />, label: "Administration" },
      { key: "4", icon: <LogoutOutlined style={{ fontSize: "16px" }} />, label: "Logout", onClick: handleLogout },
    ]}
  />
</Sider>


      {/* Content */}
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
          }}
        >
          <h1>DashBoard</h1>
          <p>Welcome to the admin dashboard!</p>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashBoard;