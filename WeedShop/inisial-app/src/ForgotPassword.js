import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/user/check-username", { username });

      if (res.data.exists) {
        setStep(2);
      } else {
        setMessage("⚠️ Username not found. Try again.");
      }
    } catch (error) {
      setMessage("❌ Error checking username. Try again later.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/user/reset-password", { username, newPassword });

      if (res.status === 200) {
        setMessage("✅ Password reset successful! Redirecting...");
        setTimeout(() => {
          onBackToLogin();
        }, 3000);
      } else {
        setMessage("❌ Failed to reset password.");
      }
    } catch (error) {
      setMessage("❌ Error resetting password. Try again later.");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="form-container">
          {step === 1 ? (
            <>
              <h1>Forgot Password</h1>
              <form onSubmit={handleUsernameSubmit}>
                <div className="input-group">
                  <label htmlFor="username">Enter Your Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                  />
                </div>
                <button type="submit" className="button-primary">Next</button>
                <button type="button" onClick={onBackToLogin} className="button-secondary">Back</button>
              </form>
            </>
          ) : (
            <>
              <h1>Reset Password</h1>
              <form onSubmit={handlePasswordReset}>
                <div className="input-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter new password"
                    />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                </div>
                <button type="submit" className="button-primary">Reset Password</button>
              </form>
            </>
          )}
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
