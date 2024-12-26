import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./footer/Footer";

import HeaderComponent from "./header/HeaderComponent";
import Contact from "./main/pages/contacts/Contact";
import Home from "./main/pages/home/Home";
import Pages from "./main/pages/pages/Pages";
import Features from "./main/pages/features/Features";
import Blog from "./main/pages/blog/Blog";
import Shop from "./main/pages/shop/Shop";
import Login from "./login/Login";
import ExamPage from "./exam/ExamPage";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/shop", element: <Shop /> },
  { path: "/contacts", element: <Contact /> },
  { path: "/pages", element: <Pages /> },
  { path: "/features", element: <Features /> },
  { path: "/blog", element: <Blog /> },
  { path: "/login", element: <Login /> },
  { path: "/exam", element: <ExamPage /> },
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
