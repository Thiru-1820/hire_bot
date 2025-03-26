// CodingRoundPage.js
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodingRoundPage.css"; // Create a CSS file for styling

const CodingRoundPage = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");

  const codingQuestion =
    "Write a function that returns the factorial of a number.";

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleSubmitCode = () => {
    // Mock execution of code - you can integrate an actual code execution API here
    if (code.includes("factorial")) {
      setOutput("Code submitted successfully.");
    } else {
      setOutput("Please write the correct function for factorial.");
    }
  };

  return (
    <div className="coding-round-page">
      <h1>Coding Round</h1>
      <div className="coding-question">
        <h3>Coding Question:</h3>
        <p>{codingQuestion}</p>
      </div>

      <div className="editor-container">
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
        />
      </div>

      <button className="submit-button" onClick={handleSubmitCode}>
        Submit Code
      </button>

      {output && (
        <div className="output-container">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodingRoundPage;
