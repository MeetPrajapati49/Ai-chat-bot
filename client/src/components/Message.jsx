function Message({ text, isUser }) {
  return (
    <div className={isUser ? "message user" : "message ai"}>
      <p>{text}</p>
    </div>
  )
}

export default Message