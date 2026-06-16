import { useState } from 'react'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 I am your CampusJugaad assistant. Ask me anything!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://campusjugaad-server.onrender.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I am having trouble. Try again!' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 32, zIndex: 1000 }}>
      {/* Chat Window */}
      {open && (
        <div style={{ width: 320, height: 420, background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1.5px solid #FFCF90', display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #7B5A2D, #9C6B3C)', borderRadius: '18px 18px 0 0', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>🤖 CampusJugaad AI</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>Ask me anything!</p>
            </div>
            <span onClick={() => setOpen(false)} style={{ color: '#fff', cursor: 'pointer', fontSize: 18 }}>✕</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: msg.from === 'user' ? 'linear-gradient(135deg, #7B5A2D, #9C6B3C)' : '#F5ECD8', color: msg.from === 'user' ? '#fff' : '#1A0C00', borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 13, maxWidth: '80%' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#F5ECD8', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: 13, color: '#8A6A50' }}>
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #FFCF90', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask something..."
              style={{ flex: 1, border: '1.5px solid #FFCF90', borderRadius: 10, padding: '8px 12px', fontFamily: 'Sora, sans-serif', fontSize: 13, outline: 'none' }} />
            <button onClick={sendMessage}
              style={{ background: 'linear-gradient(135deg, #7B5A2D, #9C6B3C)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 16 }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div onClick={() => setOpen(!open)}
        style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #7B5A2D, #9C6B3C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: 26, marginLeft: 'auto' }}>
        {open ? '✕' : '🤖'}
      </div>
    </div>
  )
}