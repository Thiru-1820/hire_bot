const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const app = express();
const PORT = 7000;
const OLLAMA_URL = "http://localhost:11434/api/generate"; // Change this if your Ollama model runs on a different port

app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://localhost:27017/mcqDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post("/generate-mcq", async (req, res) => {
    console.log("Incoming request:", req.body);

    const { topic, count, difficulty } = req.body;

    if (!topic || !count || !difficulty) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: "mcq",
            prompt: `${topic}, ${difficulty}, ${count}`,
            stream: false
        });

        const mcqList = parseMCQs(response.data.response);
        console.log("Generated MCQs:", mcqList);

        res.json({ mcqs: mcqList });
    } catch (error) {
        console.error("Error communicating with Ollama:", error);
        res.status(500).json({ error: "Failed to generate MCQs" });
    }
});

function parseMCQs(output) {
    const mcqArray = [];
    const regex = /(\d+)\. Question: (.*?)\n\s*Options:\n\s*A\) (.*?)\n\s*B\) (.*?)\n\s*C\) (.*?)\n\s*D\) (.*?)\n\s*Answer: (A|B|C|D)/g;

    let match;
    while ((match = regex.exec(output)) !== null) {
        mcqArray.push({
            question: match[2].trim(),
            options: {
                A: match[3].trim(),
                B: match[4].trim(),
                C: match[5].trim(),
                D: match[6].trim(),
            },
            answer: match[7].trim(),
        });
    }
    return mcqArray;
}
const mcqSchema = new mongoose.Schema({
    question: String,
    options: Object,
    answer: String
});

const MCQ = mongoose.model("MCQ", mcqSchema);

app.post("/save-mcq", async (req, res) => {
    try {
        await MCQ.insertMany(req.body.mcqs);
        res.status(200).json({ message: "MCQs saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error saving MCQs" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
