import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token"); // Lấy token từ cookie

  return token ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
