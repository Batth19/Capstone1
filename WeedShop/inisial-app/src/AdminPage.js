import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("login_id");
        localStorage.removeItem("login_user");
        localStorage.removeItem("login_role"); // ✅ Remove stored role
        navigate("/login"); // ✅ Redirect to About page after logout
    };

    return (
        <div style={styles.container}>
            <h1>Admin Dashboard</h1>
            <p>Manage users, products, and orders here.</p>

            {/* ✅ Logout Button */}
            <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

// ✅ Inline Styling
const styles = {
    container: {
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    logoutButton: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "20px",
        transition: "background 0.3s",
    },
    logoutButtonHover: {
        backgroundColor: "#c82333",
    },
};

export default AdminPage;
