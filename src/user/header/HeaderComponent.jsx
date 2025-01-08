import React, { useEffect, useState } from "react";
import Component from "../components/Component";
import Logo from "../components/logo/Logo";
import "./headercomponent.scss";

const menuItems = [
  { path: "/", name: "HOME" },
  { path: "/pages", name: "PAGES" },
  { path: "/features", name: "FEATURES" },
  { path: "/blog", name: "BLOG" },
  { path: "/shop", name: "SHOP" },
  { path: "/contacts", name: "CONTACT" },
];

const HeaderComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`header-container ${isScrolled ? "scrolled" : ""}`}
    >
      <div className="header-container_wrapper">
        <div className="header_logo">
          <Logo />
        </div>
        <div className="header-nav display-flex">

        </div>
        <div className="header-component">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
