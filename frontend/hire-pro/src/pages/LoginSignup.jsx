import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

function LoginSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isSignup
      ? "http://localhost:5000/api/signup"
      : "http://localhost:5000/api/login";

    try {
      const response = await axios.post(endpoint, { email, password });

      // Store token for testing purposes
      localStorage.setItem("token", response.data.token);
      navigate("/home"); // Redirect normal users to /home
    } catch (err) {
      setError(
        isSignup ? "Signup failed. Try again." : "Invalid email or password"
      );
    }
  };

  return (
    <div className="login-signup-page">
      <div className="login-box">
        <h2>{isSignup ? "Sign Up" : "Candidate Login"}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)} className="toggle-link">
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
