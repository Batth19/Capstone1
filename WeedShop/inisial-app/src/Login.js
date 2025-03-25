import React, { useState } from 'react'; 
import './Login.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ 
    onSwitchToRegister = () => console.log("Navigate to Register"), 
    onSwitchToForgotPassword = () => console.log("Forgot Password"), 
    onBack = () => console.log("Go Back") 
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ✅ Use navigate for redirection

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post('http://localhost:8080/user/login', { username, password });

            if (res.data.id > 0) {
                setMessage({ text: '✅ Login successful!', type: 'success' });

                // ✅ Store user details in local storage
                localStorage.setItem("login_id", res.data.id);
                localStorage.setItem("login_user", res.data.username);
                localStorage.setItem("login_role", res.data.role); // Store role

                setLoading(false);

                // ✅ Redirect based on role
                if (res.data.role === "ADMIN") {
                    navigate("/admin");  // Redirect to Admin Page
                } else {
                    navigate("/main");  // Redirect to Main Shop Page
                }
            } else {
                setMessage({ text: '❌ Invalid username or password.', type: 'error' });
                setLoading(false);
            }
        } catch (error) {
            setMessage({ text: '⚠️ Error logging in. Please try again.', type: 'error' });
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Side Image Section */}
                <div className="login-image">
                    <img src="https://img.freepik.com/premium-photo/trendy-sunlight-cbd-pattern-with-green-leaf-cannabis-light-blue-background-minimal-concept_296062-617.jpg" alt="Login Visual" />
                </div>

                {/* Right Side Form Section */}
                <div className="form-container">
                    <h1>🔐 Login</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username "
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="button-primary" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        <button type="button" onClick={onBack} className="button-secondary">Back</button>

                        {message && <div className={`message ${message.type}`}>{message.text}</div>}
                    </form>

                    <p>
                        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToForgotPassword(); }}>
                            ❓ Forgot Password?
                        </a>
                    </p>
                    <p>
                        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>Register here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
