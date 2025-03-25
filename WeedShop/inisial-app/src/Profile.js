import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const loginUser = localStorage.getItem("login_user");

  // If no user is logged in, redirect to login page.
  if (!loginUser) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("login_id");
    localStorage.removeItem("login_user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>User Profile</h1>
      <p>Welcome, {loginUser}!</p>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px"
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
        onClick={() => navigate("/main")}
      >
        Back to Shop
      </button>
    </div>
  );
}

export default Profile;
