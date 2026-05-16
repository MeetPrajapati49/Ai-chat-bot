import ReactMarkdown from 'react-markdown'
import React from "react"

const Message = React.memo(function Message({ text, isUser }) {
  return (
    <div className={isUser ? "message user" : "message ai"}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )

}
)

export default Message