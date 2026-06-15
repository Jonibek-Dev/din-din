import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Backendda Groq API kaliti o'rnatilmagan (.env faylini tekshiring)" });
  }
  try {
    const { messages, model } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: messages || [],
      model: model || 'llama-3.3-70b-versatile',
    });

    res.json(chatCompletion.choices[0]?.message || { role: 'assistant', content: 'No response from Groq' });
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Failed to fetch from Groq API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
