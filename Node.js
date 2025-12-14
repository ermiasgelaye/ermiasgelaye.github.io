// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: req.body.messages,
            max_tokens: 300,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'API request failed' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));