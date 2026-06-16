const express = require('express');
const router = express.Router();

router.post('/generate-listing', async (req, res) => {
  try {
    const { title } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are helping a student sell an item on CampusJugaad, a student marketplace. 
Generate a catchy title and detailed description for this item: "${title}".
Respond ONLY in this JSON format with no extra text:
{"title": "catchy title here", "description": "detailed description here in 2-3 sentences"}`
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ message: 'AI generation failed' });
  }
});

module.exports = router;