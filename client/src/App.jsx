import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/Landing'
import Sidebar from './components/Sidebar'
import ChatArea from './components/Chatarea'
import InputBox from './components/InputBox'

function Chat() {
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
  const [fileContext, setFileContext] = useState(null)

  const activeChat = chats.find(c => c.id === activeChatId)
  const messages = activeChat ? activeChat.messages : []

  async function addMessage(text, file) {
    let fileContent = null
    let fileType = null

    if (file) {
      fileType = file.type
      if (file.type === 'application/pdf') {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let pdfText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          pdfText += content.items.map(item => item.str).join(' ')
        }
        fileContent = pdfText
        setFileContext(pdfText)
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        fileContent = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result.split(',')[1])
          reader.readAsDataURL(file)
        })
      }
    }

    const userMessage = {
      id: Date.now(),
      text: text || (file ? `📎 ${file.name}` : ''),
      isUser: true
    }

    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? {
            ...chat,
            title: chat.title === "New Chat" ? (text || file?.name || 'New Chat').slice(0, 25) : chat.title,
            messages: [...chat.messages, userMessage]
          }
        : chat
    ))

    setIsLoading(true)

    try {
      // Build messages for Groq
      let groqMessages = [
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))
      ]

      // Build the last user message with file context
      let lastContent = text || 'Please analyze this file'

      if (fileContent) {
        // Fresh file uploaded
        lastContent = `${lastContent}\n\nDocument content:\n${fileContent}`
      } else if (fileContext) {
        // Use remembered file context
        lastContent = `${lastContent}\n\nContext from previously uploaded document:\n${fileContext}`
      }

      groqMessages.push({ role: 'user', content: lastContent })

      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: groqMessages,
          fileContent,
          fileType
        })
      })

      const data = await response.json()
      const aiMessage = { id: Date.now() + 1, text: data.message, isUser: false }
      setChats(prev => prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      ))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function createNewChat() {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [{ id: Date.now(), text: "Hello! How can I help you?", isUser: false }]
    }
    setChats(prev => [...prev, newChat])
    setActiveChatId(newChat.id)
    setFileContext(null)
  }

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSwitchChat={setActiveChatId}
      />
      <div className="main">
        <ChatArea messages={messages} isLoading={isLoading} />
        <InputBox onSend={addMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}

export default App