
const express = require('express')
require('dotenv').config()

const Groq = require('groq-sdk')

const Chat = require('./models/Chat')

const app = express()
const PORT = process.env.PORT || 3000

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected! ✅'))
  .catch(err => console.error('MongoDB error:', err))



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json({ limit: '50mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'NeuraChat server is running! 🚀' })
})

app.post('/chat', async (req, res) => {
  try {
    const { messages, fileContent, fileType } = req.body
    console.log('fileContent received:', fileContent?.slice(0, 100))
    console.log('fileType received:', fileType)

    let groqMessages = [...messages]

    if (fileContent) {
      if (fileType === 'application/pdf') {
        const lastMsg = groqMessages[groqMessages.length - 1]
        groqMessages[groqMessages.length - 1] = {
          role: 'user',
          content: `${lastMsg.content}\n\nDocument content:\n${fileContent}`
        }
      } else if (fileType && fileType.startsWith('image/')) {
        groqMessages[groqMessages.length - 1] = {
          role: 'user',
          content: [
            { type: 'text', text: messages[messages.length - 1].content },
            { type: 'image_url', image_url: { url: `data:${fileType};base64,${fileContent}` } }
          ]
        }
      }
    }

    const model = fileType && fileType.startsWith('image/')
      ? 'meta-llama/llama-4-scout-17b-16e-instruct'
      : 'llama-3.3-70b-versatile'

    const response = await groq.chat.completions.create({
      model,
      messages: groqMessages
    })

    res.json({ message: response.choices[0].message.content })

  } catch (error) {
    console.error('Groq error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
})
// Get all chats
app.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 })
    res.json(chats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chats' })
  }
})

// Create new chat
app.post('/chats', async (req, res) => {
  try {
    const chat = new Chat({ title: 'New Chat', messages: [] })
    await chat.save()
    res.json(chat)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' })
  }
})

// Save message to chat
app.post('/chats/:id/messages', async (req, res) => {
  try {
    const { text, isUser } = req.body
    const chat = await Chat.findById(req.params.id)
    chat.messages.push({ text, isUser })
    if (chat.title === 'New Chat' && isUser) {
      chat.title = text.slice(0, 25)
    }
    await chat.save()
    res.json(chat)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' })
  }
})

// Delete chat
app.delete('/chats/:id', async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' })
  }
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})