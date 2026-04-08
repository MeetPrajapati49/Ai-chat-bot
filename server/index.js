const express = require('express')
require('dotenv').config()
const Groq = require('groq-sdk')

const app = express()
const PORT = process.env.PORT || 3000

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Manual CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'NeuraChat server is running! 🚀' })
})

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages
    })
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