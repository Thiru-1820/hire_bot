// MCQPage.js
import React, { useState } from "react";
import "./MCQPage.css"; // Create this CSS file for styling

const MCQPage = () => {
  const mcqs = [
    {
      id: 1,
      question: "What is React?",
      options: ["Library", "Framework", "Language"],
      correctAnswer: "Framework",
    },
    {
      id: 2,
      question: "What is JSX?",
      options: ["JavaScript", "HTML", "Both"],
      correctAnswer: "Both",
    },
    // Add more MCQs here
  ];

  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleOptionChange = (mcqId, selectedOption) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [mcqId]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;

    mcqs.forEach((mcq) => {
      if (selectedOptions[mcq.id] === mcq.correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
  };

  return (
    <div className="mcq-page">
      <h1>Technical MCQs</h1>
      <div className="mcq-container">
        {mcqs.map((mcq, index) => (
          <div key={mcq.id} className="mcq">
            <h3>
              {index + 1}. {mcq.question}
            </h3>
            <div className="mcq-options">
              {mcq.options.map((option, idx) => (
                <label key={idx} className="mcq-option">
                  <input
                    type="radio"
                    name={`mcq-${mcq.id}`}
                    value={option}
                    checked={selectedOptions[mcq.id] === option}
                    onChange={() => handleOptionChange(mcq.id, option)}
                    disabled={submitted} // Disable options after submission
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={submitted}
      >
        Submit
      </button>

      {submitted && (
        <div className="mcq-result">
          <h2>
            Your Score: {score}/{mcqs.length}
          </h2>
        </div>
      )}
    </div>
  );
};

export default MCQPage;
