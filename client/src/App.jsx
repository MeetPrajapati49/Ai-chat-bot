import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/Chatarea'
import InputBox from './components/InputBox'

function App() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: [
        { id: 1, text: "Hello! How can I help you?", isUser: false }
      ]
    }
  ])
  const [activeChatId, setActiveChatId] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Get current active chat
  const activeChat = chats.find(c => c.id === activeChatId)
  const messages = activeChat ? activeChat.messages : []

  // Add message to active chat
  async function addMessage(text) {
    const userMessage = { id: Date.now(), text: text, isUser: true }

    // Add user message to active chat
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ))

    setIsLoading(true)

    try {
      const response = await fetch('https://ai-chat-bot-s0kg.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: text }
          ]
        })
      })

      const data = await response.json()
      const aiMessage = { id: Date.now() + 1, text: data.message, isUser: false }

      // Add AI message to active chat
      setChats(prev => prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      ))
      // Auto title the chat with first message
      setChats(prev => prev.map(chat =>
        chat.id === activeChatId && chat.title === "New Chat"
          ? { ...chat, title: text.slice(0, 25) }
          : chat
      ))

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Create new chat
  function createNewChat() {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        { id: Date.now(), text: "Hello! How can I help you?", isUser: false }
      ]
    }
    setChats(prev => [...prev, newChat])
    setActiveChatId(newChat.id)
  }

  // Switch to a chat
  function switchChat(chatId) {
    setActiveChatId(chatId)
  }

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSwitchChat={switchChat}
      />
      <div className="main">
        <ChatArea messages={messages} isLoading={isLoading} />
        <InputBox onSend={addMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default App