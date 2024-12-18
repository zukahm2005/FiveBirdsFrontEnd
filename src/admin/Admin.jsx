import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginAdmin from "./loginAdmin/LoginAdmin";
import DashBoard from "./dashboard/DashBoard";
import Footer from "../user/footer/Footer";
import HeaderComponent from "../user/header/HeaderComponent";
import ProtectedRoute from "./protectedroute/ProtectedRoute";
const routes = [
  { path: "/login", element: <LoginAdmin /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashBoard />
      </ProtectedRoute>
    ),
  },
];

export default function Admin() {
  return (
    <div>
      {/* <HeaderComponent /> */}
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Footer />
    </div>
  );
}
