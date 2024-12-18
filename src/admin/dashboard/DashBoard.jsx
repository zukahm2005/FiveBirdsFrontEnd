import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function DashBoard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token khỏi cookie
    Cookies.remove("token");

    // Chuyển hướng về trang login
    navigate("/admin/login");
  };

  return (
    <div>
      <h1>DashBoard</h1>
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
};
