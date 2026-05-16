import { useTheme } from '../Context/ThemeContext'

function Sidebar({ chats, activeChatId, onNewChat, onSwitchChat, onDeleteChat, isOpen, onClose }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isDark ? 'dark' : 'light'} ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: isDark ? '#ffffff' : '#111' }}>NeuraChat</h2>
          <button className="close-sidebar-btn" onClick={onClose}>✕</button>
        </div>
      
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        style={{
          padding: '8px',
          background: 'transparent',
          border: `1px solid ${isDark ? '#2a2a3a' : '#ddd'}`,
          borderRadius: '8px',
          color: isDark ? '#ffffff' : '#111',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="chat-list">
  {chats.map(chat => (
    <div
      key={chat.id}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      className={chat.id === activeChatId ? "chat-item active" : "chat-item"}
    >
      <span onClick={() => onSwitchChat(chat.id)}>
        💬 {chat.title}
      </span>
      <button
        onClick={() => onDeleteChat(chat.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6b6b' }}
      >
        🗑️
      </button>
    </div>
  ))}
</div>
      </div>
    </>
  )
}

export default Sidebar