import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./footer/Footer";
import Login from "./header/components/login/Login";
import Register from "./header/components/register/Register";
import ForgetPassword from "./header/components/forgetPassword/ForgetPassword";
import HeaderComponent from "./header/HeaderComponent";
import Contact from "./main/pages/contacts/Contact";
import Home from "./main/pages/home/Home";
import New from "./main/pages/news/New";
import Shop from "./main/pages/shop/Shop";
import VerifyOtp from "./header/components/forgetPassword/VerifyOtp";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/shop", element: <Shop /> },
  { path: "/contacts", element: <Contact /> },
  { path: "/news", element: <New /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "verify-otp", element: <VerifyOtp /> },
];

const User = () => {
  return (
    <div>
      <HeaderComponent />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Footer />
    </div>
  );
};

export default User;
