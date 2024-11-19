import React from "react";
import { Link } from "react-router-dom";
import "./headercomponent.scss";
import Logo from "./logo/Logo";
import { FaUserCircle } from "react-icons/fa";

const HeaderComponent = () => {
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
          <Link to="/login">
           
            <FaUserCircle />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
