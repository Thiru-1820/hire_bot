import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./InterviewDetail.css";

function InterviewDetail() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [rounds, setRounds] = useState([]);
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    // Fetch interview detail by ID (mock data used here for illustration)
    setInterview({
      title: "TCS",
      time: "10:00 AM",
      roundStatus: "Completed",
      result: "Selected",
    });

    // Fetch rounds (mock data used here for illustration)
    setRounds([
      {
        name: "Aptitude Round",
        duration: "20 minutes",
        timeToStart: "11:00 AM",
        isAvailable: true,
      },
      {
        name: "Coding Round",
        duration: "30 minutes",
        timeToStart: "10:30 AM",
        isAvailable: false,
      },
      {
        name: "Technical HR Round",
        duration: "20 minutes",
        timeToStart: "11:00 AM",
        isAvailable: false,
      },
    ]);

    // Event listener for when user switches tabs or minimizes window
    const handleVisibilityChange = () => {
      if (document.hidden) {
        terminateSession();
      }
    };

    // Event listener for when the user switches to another application
    const handleBlur = () => {
      terminateSession();
    };

    // Event listener for when the user closes the tab or refreshes
    const handleBeforeUnload = (event) => {
      terminateSession();
      event.preventDefault();
      event.returnValue = ""; // Required for modern browsers
    };

    // Attach event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id]);

  const terminateSession = () => {
    alert("Session terminated due to window change or inactivity.");
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/");
    }, 2000);
  };

  if (!interview) {
    return <p>Loading...</p>;
  }

  const enterRound = () => {
    navigate("/mcq"); // Navigate to the MCQ page
  };

  const enterCodingRound = () => {
    navigate("/coding-round");
  };

  return (
    <div className="interview-detail">
      <div className="interview-info">
        <h2>{interview.title}</h2>
        <p>Job Role: Software Engineer</p>
        <p>No of Round Completed: 0/5</p>
        <p>Result: -:-</p>
      </div>
      <div className="rounds-container">
        {rounds.map((round, index) => (
          <div key={index} className="round-card">
            <h4>{round.name}</h4>
            <p>Duration: {round.duration}</p>
            <p>Time to Start: {round.timeToStart}</p>
            <div className="round-card-footer">
              {round.name !== "Technical Round" ? (
                <button
                  className="enter-round-button"
                  disabled={!round.isAvailable}
                  onClick={enterRound}
                >
                  Enter Round
                </button>
              ) : (
                <button
                  className="enter-round-button"
                  disabled={!round.isAvailable}
                  onClick={enterCodingRound}
                >
                  Enter Round
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewDetail;
