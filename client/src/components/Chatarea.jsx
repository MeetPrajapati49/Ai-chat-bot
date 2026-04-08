import { useEffect, useRef } from 'react'
import Message from './Message'

function Chatarea({ messages, isLoading }) {
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-area">
      {messages.map(msg => (
        <Message key={msg.id} text={msg.text} isUser={msg.isUser} />
      ))}

      {/* Show typing indicator when AI is thinking */}
      {isLoading && (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  )
}

export default Chatarea