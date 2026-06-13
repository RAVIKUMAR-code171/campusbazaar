import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Requests() {
  const [requests, setRequests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [responding, setResponding] = useState(null)
  const [responseMsg, setResponseMsg] = useState('')
  const [form, setForm] = useState({ title: '', description: '', category: 'Books', college: '', budget: '' })
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    try {
      const res = await axios.get('https://campusjugaad-server.onrender.com/api/requests')
      setRequests(res.data)
    } catch (err) { console.log(err) }
  }

  const handleSubmit = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post('https://campusjugaad-server.onrender.com/api/requests', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      setForm({ title: '', description: '', category: 'Books', college: '', budget: '' })
      fetchRequests()
      toast.success('Request posted successfully! 📢')
    } catch (err) { toast.error('Error posting request!') }
  }

  const handleRespond = async (id) => {
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post(`https://campusjugaad-server.onrender.com/api/requests/${id}/respond`, { message: responseMsg }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResponding(null)
      setResponseMsg('')
      fetchRequests()
      toast.success('Response sent! 💬')
    } catch (err) { toast.error('Error sending response!') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return
    try {
      await axios.delete(`https://campusjugaad-server.onrender.com/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchRequests()
      toast.success('Request deleted!')
    } catch (err) { toast.error('Error deleting!') }
  }

  const C = {
    bg: '#f8f9ff', surface: '#ffffff', border: '#e2e8f0',
    navBg: '#0f1c3f', primary: '#c9a84c', light: '#ffffff',
    text: '#1e293b', muted: '#64748b', card: '#ffffff'
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: C.bg, minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ background: C.navBg, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 20, fontWeight: 800, color: C.primary, cursor: 'pointer' }}>🎓 CampusJugaad</span>
        <button onClick={() => navigate('/')}
          style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora,sans-serif', fontWeight: 500, cursor: 'pointer', color: '#fff', fontSize: 14 }}>
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 8 }}>📢 Requests</h1>
            <p style={{ color: C.muted, fontSize: 16 }}>Need something? Post a request and let others help you find it.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: `linear-gradient(135deg, #0f1c3f, #1a3a6b)`, color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 14, padding: '12px 24px', fontFamily: 'Sora,sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            + Post a Request
          </button>
        </div>

        {/* Post Form */}
        {showForm && (
          <div style={{ background: C.surface, borderRadius: 20, padding: 28, border: `1.5px solid ${C.border}`, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20 }}>What are you looking for?</h2>
            {[
              { label: 'Title', name: 'title', placeholder: 'e.g. I need a Physics book by HC Verma', type: 'text' },
              { label: 'Budget (₹)', name: 'budget', placeholder: 'e.g. 200', type: 'number' },
              { label: 'College', name: 'college', placeholder: 'e.g. DTU', type: 'text' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} value={form[field.name]}
                  onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} name={field.name}
                  style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora,sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>Description</label>
              <textarea placeholder="Describe what you need..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora,sans-serif', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora,sans-serif', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                {['Books', 'Electronics', 'Furniture', 'Transport', 'Stationery', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleSubmit}
                style={{ flex: 1, background: C.navBg, color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 14, padding: '12px', fontFamily: 'Sora,sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                Post Request
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ padding: '12px 20px', background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 14, fontFamily: 'Sora,sans-serif', cursor: 'pointer', color: C.muted }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: C.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: C.text }}>No requests yet</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Be the first to post a request!</p>
          </div>
        ) : requests.map(req => (
          <div key={req._id} style={{ background: C.surface, borderRadius: 20, padding: 24, border: `1.5px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ background: '#f0f4ff', color: '#0f1c3f', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>{req.category}</span>
                <span style={{ background: req.status === 'open' ? '#f0fdf4' : '#fff1f2', color: req.status === 'open' ? '#166534' : '#991b1b', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
                  {req.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                </span>
              </div>
              {user && req.postedBy?._id === user.id && (
                <button onClick={() => handleDelete(req._id)}
                  style={{ background: '#fff1f2', color: '#991b1b', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Delete
                </button>
              )}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{req.title}</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>{req.description}</p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: C.muted }}>💰 Budget: <strong style={{ color: C.text }}>₹{req.budget}</strong></span>
              <span style={{ fontSize: 13, color: C.muted }}>📍 {req.college}</span>
              <span style={{ fontSize: 13, color: C.muted }}>👤 {req.postedBy?.name}</span>
              <span style={{ fontSize: 13, color: C.muted }}>💬 {req.responses?.length || 0} responses</span>
            </div>

            {/* Responses */}
            {req.responses?.length > 0 && (
              <div style={{ background: '#f8f9ff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                {req.responses.map((r, i) => (
                  <div key={i} style={{ borderBottom: i < req.responses.length - 1 ? '1px solid #e2e8f0' : 'none', paddingBottom: i < req.responses.length - 1 ? 12 : 0, marginBottom: i < req.responses.length - 1 ? 12 : 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.user?.name}: </span>
                    <span style={{ fontSize: 13, color: C.muted }}>{r.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Respond */}
            {responding === req._id ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={responseMsg} onChange={e => setResponseMsg(e.target.value)}
                  placeholder="Type your response..." 
                  style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', fontFamily: 'Sora,sans-serif', fontSize: 14, outline: 'none' }} />
                <button onClick={() => handleRespond(req._id)}
                  style={{ background: C.navBg, color: C.primary, border: 'none', borderRadius: 10, padding: '10px 16px', fontFamily: 'Sora,sans-serif', fontWeight: 600, cursor: 'pointer' }}>
                  Send
                </button>
                <button onClick={() => setResponding(null)}
                  style={{ background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '10px 16px', fontFamily: 'Sora,sans-serif', cursor: 'pointer', color: C.muted }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => token ? setResponding(req._id) : navigate('/login')}
                style={{ background: '#f0f4ff', color: '#0f1c3f', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 20px', fontFamily: 'Sora,sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                💬 Respond
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}