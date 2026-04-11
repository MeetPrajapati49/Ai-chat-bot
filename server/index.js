const express = require('express')
require('dotenv').config()
const Groq = require('groq-sdk')

const app = express()
const PORT = process.env.PORT || 3000

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})