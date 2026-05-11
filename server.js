const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors(), express.json());

const API_KEY = "AIzaSyA9ML9x43Tsd2zjQP_arWsnUbBsD-tobaA"; 

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/check-answer', async (req, res) => {
    const { studentName, question, correctAnswer, studentAnswer } = req.body;
    
    const prompt = `Act as an expert, unbiased educational supervisor. 
    Evaluate the following quiz submission for student: ${studentName}.
    1. Quiz Question: "${question}"
    2. Teacher's Provided Key: "${correctAnswer}"
    3. Student's Answer: "${studentAnswer}"

    Instructions:
    - Verify if the teacher's key is factually correct.
    - If the teacher is wrong but the student is right, grade the student as 10/10.
    - Provide a score/10 and helpful feedback.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        res.json({ feedback: data.candidates[0].content.parts[0].text });
    } catch (e) {
        res.status(500).json({ feedback: "Connection Error" });
    }
});

app.listen(3000, () => console.log('Server Live: http://localhost:3000'));