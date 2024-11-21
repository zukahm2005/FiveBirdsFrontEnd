import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./headercomponent.scss";
import Logo from "./logo/Logo";
import { Modal, Button, message } from "antd";
import userApi from "../../api/userApi/UserApi";
import { FaUserCircle } from "react-icons/fa";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await userApi.get("/checktoken");
        if (response.status === 200 && response.data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await userApi.post("/logout");
          if (response.status === 200) {
            message.success(response.data.message);
            setIsLoggedIn(false);
            navigate("/login");
          }
        } catch (error) {
          message.error("Failed to logout!");
        }
      },
      onCancel: () => {
        message.info("Logout canceled.");
      },
    });
  };

  return (
    <div className="header-container">
      <div className="header-container_wrapper">
        <div className="header_logo">
          <Logo />
        </div>
        <div className="header-nav display-flex">
          <nav>
            <Link to="/">Home</Link>
          </nav>
          <nav>
            <Link to="/shop">Shop</Link>
          </nav>
          <nav>
            <Link to="/contacts">Contacts</Link>
          </nav>
          <nav>
            <Link to="/news">News</Link>
          </nav>
        </div>
        <div className="header-component">
          {isLoggedIn ? (
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <FaUserCircle />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
