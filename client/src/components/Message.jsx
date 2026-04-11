import ReactMarkdown from 'react-markdown'

function Message({ text, isUser }) {
  return (
    <div className={isUser ? "message user" : "message ai"}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )
}

export default Message