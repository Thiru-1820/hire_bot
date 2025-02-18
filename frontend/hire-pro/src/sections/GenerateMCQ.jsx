import React, { useState } from "react";

const GenerateMCQ = () => {
    const [topic, setTopic] = useState("");
    const [count, setCount] = useState(5);
    const [difficulty, setDifficulty] = useState("Normal");
    const [mcqs, setMcqs] = useState([]);

    const fetchMCQs = async () => {
        try {
            const response = await fetch("http://localhost:5000/generate-mcq", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic, count, difficulty }),
            });

            const data = await response.json();
            if (data.mcqs) {
                setMcqs(data.mcqs);
            }
        } catch (error) {
            console.error("Error fetching MCQs:", error);
        }
    };

    return (
        <div>
            <h2>Generate MCQs</h2>
            <input
                type="text"
                placeholder="Enter topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />
            <input
                type="number"
                placeholder="Number of Questions"
                value={count}
                onChange={(e) => setCount(e.target.value)}
            />
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Very-Easy">Very Easy</option>
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
                <option value="Very-Hard">Very Hard</option>
            </select>
            <button onClick={fetchMCQs}>Generate</button>

            <h3>Generated MCQs:</h3>
            {mcqs.length > 0 && (
                <ul>
                    {mcqs.map((mcq, index) => (
                        <li key={index}>
                            <p><b>{index + 1}. {mcq.question}</b></p>
                            <p>A) {mcq.options.A}</p>
                            <p>B) {mcq.options.B}</p>
                            <p>C) {mcq.options.C}</p>
                            <p>D) {mcq.options.D}</p>
                            <p><b>Answer:</b> {mcq.answer}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GenerateMCQ;
