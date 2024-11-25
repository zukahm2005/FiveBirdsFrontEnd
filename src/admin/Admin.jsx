import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MdEditNote } from "react-icons/md";
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import "./admin.scss";
import ListUser from "./components/userAdmin/listUser/ListUser";
import EditorColumn from "./components/footereditAdmin/editorColumn/EditorColumn";
import AboutUsAdmin from "./components/aboutUsAdmin/AboutUsAdmin";
const { Header, Content, Sider } = Layout;

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedContent, setSelectedContent] = useState("Dashboard");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const adminInfo = {
    name: "Admin Name",
    email: "admin@example.com",
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Profile",
        },
        {
          key: "2",
          label: "Logout",
        },
      ]}
    />
  );

  const menuItems = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "UserAdmin",
      className: "custom-submenu",
      children: [
        {
          key: "listUser",
          label: "ListUser",
          className: "custom-menu-item",
        },
      ],
    },
    {
      key: "sub2",
      icon: <ShoppingOutlined />,
      label: "ProductAdmin",
      children: [
        {
          key: "productList",
          label: "Product List",
        },
      ],
    },
    {
      key: "footerEditAdmin", // Nhóm chính cho FooterEditAdmin
      icon: <MdEditNote />,
      label: "FooterEditAdmin",
      children: [
        {
          key: "editorColumn", // Mục con Editor Column
          label: "Editor Column",
        },
      ],
    },
    {
      key: "aboutUsAdmin",
      icon: <MdEditNote />,
      label: "About Us",
      children: [
        {
          key: "aboutUsList",
          label: "About Us List",
        },
        {
          key: "aboutUsEditor",
          label: "About Us Editor",
        },
      ],
    },
  ];

  const handleMenuClick = (e) => {
    setSelectedContent(e.key);
  };

  return (
    <div className="admin-container">
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            My Admin Logo
          </div>

          <Dropdown
            overlay={userMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "white",
              }}
            >
              <Avatar
                style={{
                  backgroundColor: "#87d068",
                  marginRight: 8,
                }}
                icon={<UserOutlined />}
              />
              {adminInfo.name}
            </div>
          </Dropdown>
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={toggleCollapsed}
            trigger={null}
            width={300}
            style={{
              padding: "1rem",
              background: colorBgContainer,
              minHeight: "100vh",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: collapsed ? "center" : "flex-end",
                padding: "10px",
              }}
            >
              <div
                onClick={toggleCollapsed}
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "5px",
                  color: "#1890ff",
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
                borderRight: 0,
              }}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </Sider>
          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Breadcrumb
              items={[
                {
                  title: "Home",
                },
                {
                  title: "List",
                },
                {
                  title: selectedContent,
                },
              ]}
              style={{
                margin: "16px 0",
              }}
            />
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {selectedContent === "Dashboard" && (
                <div>Welcome to Dashboard</div>
              )}
              {selectedContent === "listUser" && (
                <div>
                  <ListUser />
                </div>
              )}
              {selectedContent === "productList" && <div>List of Products</div>}
              {selectedContent === "editorColumn" && (
                <div>
                  <EditorColumn />
                </div>
              )}
              {selectedContent === "aboutUsList" && <AboutUsAdmin />}
              {selectedContent === "aboutUsEditor" && (
                <div>
                  <AboutUsAdmin />
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default Admin;
