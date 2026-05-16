const connectDB = require('../../_lib/db')
const Chat = require('../../_lib/chat')

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await connectDB()

  try {
    const { id } = req.query
    const { text, isUser } = req.body

    const chat = await Chat.findById(id)
    if (!chat) return res.status(404).json({ error: 'Chat not found' })

    chat.messages.push({ text, isUser })
    if (chat.title === 'New Chat' && isUser) {
      chat.title = text.slice(0, 25)
    }
    await chat.save()

    return res.status(200).json(chat)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save message' })
  }
}
