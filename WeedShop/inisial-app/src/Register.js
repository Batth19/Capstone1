import React, { useState } from 'react'; 
import './Register.css'; 
import axios from 'axios';

const Register = ({ onSwitchToLogin = () => console.log("Navigate to Login") }) => {
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [message, setMessage] = useState(''); 
    const [showPassword, setShowPassword] = useState(false); 

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Function to validate password strength
    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasNumber = /[0-9]/;
        const hasSpecialChar = /[@$!%*?&]/;

        if (!minLength.test(password)) return "⚠️ Password must be at least 8 characters.";
        if (!hasUppercase.test(password)) return "⚠️ Password must include at least one uppercase letter.";
        if (!hasLowercase.test(password)) return "⚠️ Password must include at least one lowercase letter.";
        if (!hasNumber.test(password)) return "⚠️ Password must include at least one number.";
        if (!hasSpecialChar.test(password)) return "⚠️ Password must include at least one special character (@$!%*?&).";

        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        // Basic Validations
        if (!username || !email || !password || !confirmPassword) {
            setMessage('⚠️ All fields are required.');
            return;
        }

        // Password validation
        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setMessage('⚠️ Passwords do not match.');
            return;
        }

        const user = {
            username,
            email,
            password
        };

        try {
            const response = await axios.post('http://localhost:8080/user/create', user);

            if (response.status === 200) {
                setMessage('✅ Registration successful! Redirecting...');
                setTimeout(() => {
                    onSwitchToLogin();
                }, 3000); 
            } else {
                setMessage('❌ Registration failed. Try again.');
            }
        } catch (error) {
            setMessage('❌ Error registering. Please try again.');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                {/* Left Image Section */}
                <div className="register-image">
                    <img 
                        src="https://images.unsplash.com/photo-1599564576463-d038c6945bb5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FubmFiaXN8ZW58MHx8MHx8fDA%3D" 
                        alt="Register Visual"
                    />
                </div>

                {/* Right Form Section */}
                <div className="form-container">
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                               
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <button type="submit" className="register-button">Register</button>
                        {message && <div className="message">{message}</div>}
                    </form>
                    <p>
                        Already have an account? 
                        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}> Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
