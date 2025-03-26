const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 8000;
const OLLAMA_URL = "http://localhost:11434/api/generate"; 

app.use(express.json());
app.use(cors());

app.post("/start", async (req, res) => {
    console.log(req.body);
    queryModel("technical ,(OOP,Data Structures),Hard", res);
});

app.post("/interview", async (req, res) => {
    const { message } = req.body;
    console.log(message);
    queryModel(message, res);
});

app.post("/end", async (req, res) => {
    queryModel("End the interview", res);
});

async function queryModel(prompt, res) {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: "interviewer",
            prompt: prompt,
            stream: false
        });

        res.setHeader("Content-Type", "application/json");
        console.log(response.data.response);
        if(prompt=="End the interview"){
            res.json("Thank you for attending the interview! You may close this window now.")
        }else{
        res.json(response.data.response);}
    } catch (error) {
        console.error("Error communicating with Ollama:", error);
        res.status(500).json({ error: "Failed to process interview" });
    }
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
