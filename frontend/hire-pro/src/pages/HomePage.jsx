import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Sample interviews data (replace with dynamic data from API)
  const interviews = [
    { id: 1, company: "Company A", time: "10:00 AM" },
    { id: 2, company: "Company B", time: "1:00 PM" },
    { id: 3, company: "Company C", time: "3:00 PM" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-credentials",
        {
          email,
          password,
          company,
        }
      );

      console.log("API Response:", response);

      if (response.status === 200) {
        // Find the interview ID based on the selected company
        const selectedInterview = interviews.find(
          (interview) => interview.company === company
        );

        if (selectedInterview) {
          navigate("/interview-chat");
        } else {
          setError("Interview not found for the selected company.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);

      if (error.response && error.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Error verifying credentials. Please try again.");
      }
    }
  };

  return (
    <div className="home-page">
      <div className="profile-section">
        <img
          src="https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg"
          alt="Profile"
          className="profile-photo"
        />
        <h2>Your Profile</h2>
        <p>Name: Vijai Varshan</p>
        <p>Position: Software Developer</p>
      </div>

      <div className="main-content">
        <h2>Interviews</h2>
        <p>Enter your credentials to attend an interview:</p>

        <form onSubmit={handleSubmit} className="credentials-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          >
            <option value="">Select Company</option>
            {interviews.map((interview) => (
              <option key={interview.id} value={interview.company}>
                {interview.company}
              </option>
            ))}
          </select>
          <button type="submit">Proceed to Interview</button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default HomePage;
