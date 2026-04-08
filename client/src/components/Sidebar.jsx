function Sidebar({ chats, activeChatId, onNewChat, onSwitchChat }) {
  return (
    <div className="sidebar">
      <h2>NeuraChat</h2>
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>
      <div className="chat-list">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={chat.id === activeChatId ? "chat-item active" : "chat-item"}
            onClick={() => onSwitchChat(chat.id)}
          >
            💬 {chat.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar