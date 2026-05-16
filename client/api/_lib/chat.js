const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  text: String,
  isUser: Boolean,
  createdAt: { type: Date, default: Date.now }
})

const chatSchema = new mongoose.Schema({
  title: { type: String, default: 'New Chat' },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
})

// Prevent model re-compilation on warm invocations
module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
