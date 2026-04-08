const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Groq = require('groq-sdk')

const app = express()
const PORT = 3000

// Initialize Groq with your API key from .env
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

app.use(cors({
  origin: 'https://ai-chat-bot-omega-snowy.vercel.app'
}))
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'NeuraChat server is running! 🚀' })
})

// Chat route — this is the main one
app.post('/chat', async (req, res) => {
  try {
    // Get messages from React
    const { messages } = req.body

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages
    })

    // Send AI response back to React
    const aiMessage = response.choices[0].message.content
    res.json({ message: aiMessage })

  } catch (error) {
    console.error('Groq error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})