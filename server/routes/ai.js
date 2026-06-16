const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate-listing', async (req, res) => {
  try {
    const { title } = req.body;
    
    const { data } = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are helping a student sell an item on CampusJugaad, a student marketplace. 
Generate a catchy title and detailed description for this item: "${title}".
Respond ONLY in this JSON format with no extra text:
{"title": "catchy title here", "description": "detailed description here in 2-3 sentences"}`
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        }
      });

    const text = data.content[0].text;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ message: 'AI generation failed' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
   const { data } = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `You are a helpful assistant for CampusJugaad, a student marketplace in India where students can buy, sell and rent items like books, electronics, furniture etc.
Answer this student's question helpfully and concisely in 2-3 sentences max: ${message}`
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        }
      });

    const text = data.content[0].text;
    res.json({ reply: text });
  } catch (err) {
    console.error('chat error:', err);
    res.status(500).json({ message: 'chat failed' });
  }
});

module.exports = router;