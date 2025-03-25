import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import About from "./About";
import Login from "./Login";
import Register from "./Register";
import MainPage from "./MainPage";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
import ProductPage from "./ProductPage";
import AdminPage from "./AdminPage"; // ✅ Ensure AdminPage.js exists

function App() {
  return (
    <Router>
      <MainRoutes />
    </Router>
  );
}

function MainRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route 
        path="/login" 
        element={
          <Login 
            onLoginSuccess={() => {
              const role = localStorage.getItem("login_role"); 
              navigate(role === "ADMIN" ? "/admin" : "/main"); // ✅ Redirect ADMINs to /admin
            }} 
            onSwitchToRegister={() => navigate("/register")} 
            onSwitchToForgotPassword={() => navigate("/forgot-password")} 
            onBack={() => navigate("/")} 
          />
        } 
      />
      <Route 
        path="/register" 
        element={<Register onSwitchToLogin={() => navigate("/login")} />} 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPassword onBackToLogin={() => navigate("/login")} />} 
      />
      <Route path="/main" element={<MainPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/admin" element={<AdminPage />} /> {/* ✅ New Admin Page Route */}
    </Routes>
  );
}

export default App;
