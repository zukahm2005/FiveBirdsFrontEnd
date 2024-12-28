import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import { Layout, Menu, Button, theme } from "antd";
import Cookies from "js-cookie";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import img from "../../common/img/image.png"; // Đường dẫn logo
import './baselayout.scss'
const { Header, Sider, Content } = Layout;

const BaseLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/admin/login");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={80}
        width={300}
        style={{
          height: "100vh",
          transition: "all 0.3s ease",
          backgroundColor: "#001529",
        }}
      >
        {/* Logo */}
        <div className="logo-container">
          <div className="img-logo">
            <img
              src={img}
              alt="Logo"
              style={{
                width: collapsed ? "40px" : "80px",
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
  mode="inline" // Chuyển chế độ hiển thị của menu thành inline
  selectedKeys={[location.pathname]} // Đường dẫn hiện tại
  defaultOpenKeys={["2"]} // Giữ menu con "Test" mở
  triggerSubMenuAction="hover" // Hiển thị popup khi hover

  style={{
    width: "90%",
    fontSize: "14px",
    lineHeight: "1.5",
  }}
  items={[
    {
      key: "/admin",
      icon: <AppstoreOutlined />,
      label: <a href="/admin">DashBoard</a>,
    },
    {
      key: "2",
      icon: <FileTextOutlined />,
      label: "Test",
      children: [
        {
          key: "/admin/test/all-tests",
          label: <a href="/admin/test/all-tests">All Tests</a>,
        },
        {
          key: "/admin/test/create-test",
          label: <a href="/admin/test/create-test">Create Test</a>,
        },
      ],
    },
    {
      key: "/admin/administration",
      icon: <UserOutlined />,
      label: <a href="/admin/administration">Administration</a>,
    },
    {
      key: "/admin/manager-candidate",
      icon: <UserOutlined />,
      label: <a href="/admin/manager-candidate">Manager Candidate </a>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
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
          <Outlet /> {/* Hiển thị nội dung các trang con */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
