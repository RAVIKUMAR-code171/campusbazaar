import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const socket = io('https://campusjugaad-server.onrender.com')

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [listing, setListing] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const { listingId, otherUserId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchMessages()
    fetchListing()

    // Join socket room
    socket.emit('join', user?.id)

    // Listen for new messages
    socket.on('receiveMessage', (data) => {
      setMessages(prev => [...prev, data])
    })

    return () => {
      socket.off('receiveMessage')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://campusjugaad-server.onrender.com/api/messages/${listingId}/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const fetchListing = async () => {
    try {
      const res = await axios.get(`https://campusjugaad-server.onrender.com/api/listings/${listingId}`)
      setListing(res.data)
      setOtherUser(res.data.seller)
    } catch (err) {
      console.log(err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    try {
      const res = await axios.post('https://campusjugaad-server.onrender.com/api/messages', {
        receiver: otherUserId,
        listing: listingId,
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Emit to socket
      socket.emit('sendMessage', {
        ...res.data,
        receiver: otherUserId
      })

      setMessages(prev => [...prev, res.data])
      setNewMessage('')
    } catch (err) {
      alert('Error sending message')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#f7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 18, color: '#5a4fa3' }}>Loading chat...</p>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#f7f5ff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ede9ff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1.5px solid #d4ceff', borderRadius: 10, padding: '6px 14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', color: '#5a4fa3' }}>←</button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1035', margin: 0 }}>{otherUser?.name || 'Seller'}</p>
            <p style={{ fontSize: 12, color: '#7c6fb8', margin: 0 }}>About: {listing?.title}</p>
          </div>
        </div>
        <span onClick={() => navigate('/')} style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>🎓 CampusJugaad</span>
      </nav>

      {/* Listing Info */}
      {listing && (
        <div style={{ background: '#fff', borderBottom: '1px solid #ede9ff', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: '#f0eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {listing.image ? <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1035', margin: 0 }}>{listing.title}</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#5a3ff5', margin: 0 }}>₹{listing.price}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700, width: '100%', margin: '0 auto' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#7c6fb8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1035' }}>No messages yet</p>
            <p style={{ fontSize: 14 }}>Start the conversation!</p>
          </div>
        ) : messages.map((msg, i) => {
          const isMe = msg.sender?._id === user?.id || msg.sender === user?.id
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '70%', background: isMe ? 'linear-gradient(135deg, #5a3ff5, #9b5de5)' : '#fff', color: isMe ? '#fff' : '#1a1035', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '12px 16px', border: isMe ? 'none' : '1.5px solid #ede9ff' }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{msg.message}</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.7, textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#fff', borderTop: '1px solid #ede9ff', padding: '16px 24px', display: 'flex', gap: 12, width: '100%', boxSizing: 'border-box' }}>
        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ flex: 1, border: '1.5px solid #d4ceff', borderRadius: 14, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none' }} />
        <button onClick={sendMessage}
          style={{ background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 24px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          Send
        </button>
      </div>
    </div>
  )
}