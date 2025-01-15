import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Modal, theme } from "antd";
import Cookies from "js-cookie";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
    FileTextOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import img from "../../common/img/image.png";
import "./baselayout.scss";

const { Header, Sider, Content } = Layout;

const BaseLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); // Trạng thái Modal
    const navigate = useNavigate();
    const location = useLocation();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const showLogoutModal = () => {
        setIsLogoutModalVisible(true);
    };

    const handleLogoutConfirm = () => {
        Cookies.remove("token");
        setIsLogoutModalVisible(false);
        navigate("/admin/login");
    };

    const handleLogoutCancel = () => {
        setIsLogoutModalVisible(false);
    };

    return (
        <Layout style={{ height: "100vh" }}>
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
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={["2"]}
                    triggerSubMenuAction="hover"
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
                            label: "Exam",
                            children: [
                                {
                                    key: "/admin/exam/all-exams",
                                    label: <a href="/admin/exam/all-exams">All Exam</a>,
                                },
                                {
                                    key: "/admin/exam/create-exam",
                                    label: <a href="/admin/exam/create-exam">Create Exam</a>,
                                },
                            ],
                        },
                        {
                            key: "/admin/administration",
                            icon: <UserOutlined />,
                            label: <a href="/admin/administration">Management Admin</a>,
                        },
                        {
                            key: "/admin/position",
                            icon: <UserOutlined />,
                            label: <a href="/admin/position">Management Position</a>,
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
                            onClick: showLogoutModal,
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
                    <Outlet />
                </Content>
            </Layout>

            {/* Logout Confirmation Modal */}
            <Modal
                title="Confirm Logout"
                visible={isLogoutModalVisible}
                onOk={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
                okText="Logout"
                cancelText="Cancel"
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
        </Layout>
    );
};

export default BaseLayout;
