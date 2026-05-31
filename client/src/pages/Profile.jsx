import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', college: '' })
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const [listingsRes] = await Promise.all([
        axios.get('https://campusjugaad-server.onrender.com/api/listings/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      setListings(listingsRes.data)
      setUser(storedUser)
      setForm({ name: storedUser?.name || '', college: storedUser?.college || '' })
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const categoryIcons = {
    Books: '📚', Electronics: '💻', Furniture: '🪑',
    Transport: '🚲', Stationery: '✏️'
  }

  if (loading) return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#f7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 18, color: '#5a4fa3' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#f7f5ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ede9ff', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>🎓 CampusBazaar</span>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: '#5a4fa3' }}>← Back</button>
      </nav>

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>

        {/* Profile Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1.5px solid #ede9ff', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
              👤
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', marginBottom: 4 }}>{user?.name}</h1>
              <p style={{ color: '#7c6fb8', fontSize: 15 }}>🎓 {user?.college}</p>
              <p style={{ color: '#7c6fb8', fontSize: 14 }}>📧 {user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              ['📦', listings.length, 'Listings'],
              ['❤️', '—', 'Wishlist'],
              ['⭐', '—', 'Reviews'],
            ].map(([icon, val, label]) => (
              <div key={label} style={{ background: '#f7f5ff', borderRadius: 16, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#5a3ff5' }}>{val}</div>
                <div style={{ fontSize: 13, color: '#7c6fb8' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/wishlist')}
              style={{ background: '#f0eeff', color: '#5a3ff5', border: 'none', borderRadius: 12, padding: '10px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              ❤️ My Wishlist
            </button>
            <button onClick={() => navigate('/requests')}
              style={{ background: '#f0eeff', color: '#5a3ff5', border: 'none', borderRadius: 12, padding: '10px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              📢 My Requests
            </button>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }}
              style={{ background: '#fff0f0', color: '#e53935', border: 'none', borderRadius: 12, padding: '10px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* My Listings */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1.5px solid #ede9ff' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1035', marginBottom: 24 }}>📦 My Listings ({listings.length})</h2>

          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40 }}>📭</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1035', marginTop: 12 }}>No listings yet</p>
              <button onClick={() => navigate('/create')}
                style={{ marginTop: 16, background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 24px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
                + Post a Listing
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {listings.map(item => (
                <div key={item._id} onClick={() => navigate(`/listing/${item._id}`)}
                  style={{ background: '#f7f5ff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1.5px solid #ede9ff' }}>
                  <div style={{ background: item.type === 'rent' ? '#fff3e0' : '#f0eeff', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, overflow: 'hidden' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      categoryIcons[item.category] || '📦'
                    )}
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1035', marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ fontSize: 18, fontWeight: 800, color: '#5a3ff5' }}>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}