const connectDB = require('./_lib/db')
const Chat = require('./_lib/chat')

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  await connectDB()

  // GET /api/chats — list all chats
  if (req.method === 'GET') {
    try {
      const chats = await Chat.find().sort({ createdAt: -1 })
      return res.status(200).json(chats)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get chats' })
    }
  }

  // POST /api/chats — create new chat
  if (req.method === 'POST') {
    try {
      const chat = new Chat({ title: 'New Chat', messages: [] })
      await chat.save()
      return res.status(200).json(chat)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create chat' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
