import { useState, useRef } from 'react'

function InputBox({ onSend, isLoading }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const fileRef = useRef()

  function handleSend() {
    if (!text.trim() && !file) return
    onSend(text, file)
    setText('')
    setFile(null)
    fileRef.current.value = ''
  }

  return (
    <div className="input-box">
      <button
        className="attach-btn"
        onClick={() => fileRef.current.click()}
      >
        📎
      </button>
      <input
        type="file"
        ref={fileRef}
        accept="image/*,.pdf"
        style={{ display: 'none' }}
        onChange={(e) => setFile(e.target.files[0])}
      />
      {file && (
        <span className="file-name">
          {file.name} ✕
        </span>
      )}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={isLoading}
      />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? '...' : 'Send'}
      </button>
    </div>
  )
}

export default InputBox