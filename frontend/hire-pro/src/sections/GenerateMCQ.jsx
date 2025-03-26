import React, { useState } from "react";

const GenerateMCQ = () => {
    const [topic, setTopic] = useState("");
    const [count, setCount] = useState(5);
    const [difficulty, setDifficulty] = useState("Normal");
    const [mcqs, setMcqs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMCQs = async () => {
        setLoading(true);
        setMcqs([]);
        try {
            const response = await fetch("http://localhost:7000/generate-mcq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, count, difficulty }),
            });
            const data = await response.json();
            if (data.mcqs) setMcqs(data.mcqs);
        } catch (error) {
            console.error("Error fetching MCQs:", error);
        }
        setLoading(false);
    };

    const saveMCQs = async () => {
        try {
            await fetch("http://localhost:7000/save-mcq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mcqs }),
            });
            alert("MCQs saved successfully!");
        } catch (error) {
            console.error("Error saving MCQs:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Generate MCQs</h2>
            <div className="space-y-4">
                <input type="text" placeholder="Enter topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" />
                <input type="number" placeholder="Number of Questions" value={count} onChange={(e) => setCount(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg">
                    <option value="Very-Easy">Very Easy</option>
                    <option value="Easy">Easy</option>
                    <option value="Normal">Normal</option>
                    <option value="Hard">Hard</option>
                    <option value="Very-Hard">Very Hard</option>
                </select>
                <button onClick={fetchMCQs} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Generate</button>
            </div>

            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-30">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg text-gray-700">Loading...</p>
                    </div>
                </div>
            )}

            {mcqs.length > 0 && (
                <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Generated MCQs:</h3>
                    <ul className="space-y-6">
                        {mcqs.map((mcq, index) => (
                            <li key={index} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                                <p className="font-semibold text-lg text-gray-900">{index + 1}. {mcq.question}</p>
                                <p className="text-gray-700">A) {mcq.options.A}</p>
                                <p className="text-gray-700">B) {mcq.options.B}</p>
                                <p className="text-gray-700">C) {mcq.options.C}</p>
                                <p className="text-gray-700">D) {mcq.options.D}</p>
                                <p className="text-green-600 font-bold mt-2">Answer: {mcq.answer}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-4 mt-4">
                        <button onClick={saveMCQs} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Add</button>
                        <button onClick={fetchMCQs} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Generate Another</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateMCQ;
