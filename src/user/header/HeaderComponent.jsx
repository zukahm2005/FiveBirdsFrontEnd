import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import "./headercomponent.scss";
import Logo from "./logo/Logo";
import { Modal, Button, message } from "antd";
import { FaUserCircle } from "react-icons/fa";

const HeaderComponent = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        localStorage.removeItem("token");
        
        message.success("Logged out successfully!");

        navigate("/login");
      },
      onCancel: () => {
        message.info("Logout canceled.");
      },
    });
  };

  const isLoggedIn = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('token'));
  console.log(isLoggedIn)


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
