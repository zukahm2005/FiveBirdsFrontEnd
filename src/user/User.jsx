import React from "react";
import {Route, Routes, useLocation} from "react-router-dom";
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
  { path: "/candidate-login", element: <Login /> },
  { path: "/exam", element: <ExamPage /> },
];

const User = () => {
    const localtion = useLocation();

    const noHeaderFooter = ["/candidate-login", "/exam"];

    const showHeaderFooter = !noHeaderFooter.includes(localtion.pathname);
  return (
      <div>
          {showHeaderFooter && <HeaderComponent/>}
          <Routes>
              {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element}/>
              ))}
          </Routes>
          {showHeaderFooter && <Footer/>}
      </div>
  );
};

export default User;
