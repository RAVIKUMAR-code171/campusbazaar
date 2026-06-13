import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchMyListings()
  }, [])

  const fetchMyListings = async () => {
    try {
      const res = await axios.get('https://campusjugaad-server.onrender.com/api/listings')
      const mine = res.data.filter(l => l.seller?._id === user.id)
      setListings(mine)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`https://campusjugaad-server.onrender.com/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setListings(listings.filter(l => l._id !== id))
    } catch (err) {
      alert('Error deleting listing')
    }
  }

  const categoryEmoji = {
    Books: '📚', Electronics: '💻', Furniture: '🪑', Transport: '🚲', Stationery: '✏️'
  }

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#F5ECD8', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #FFCF90', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>🎓 CampusBazaar</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/create')} style={{ background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer' }}>+ Post Listing</button>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: '#5a4fa3' }}>← Back</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 32px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>My Listings</h1>
        <p style={{ color: '#7c6fb8', marginBottom: 32 }}>Manage all your posted listings</p>

        {loading ? (
          <p style={{ color: '#7c6fb8' }}>Loading...</p>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#1a1035', marginTop: 16 }}>No listings yet</p>
            <p style={{ color: '#7c6fb8', marginBottom: 24 }}>Post your first listing and start selling!</p>
            <button onClick={() => navigate('/create')} style={{ background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 32px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>+ Post Listing</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {listings.map(item => (
              <div key={item._id} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #ede9ff', overflow: 'hidden' }}>
                <div style={{ background: item.type === 'rent' ? '#fff3e0' : '#f0eeff', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                  {categoryEmoji[item.category] || '📦'}
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1035', marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#5a3ff5', marginBottom: 8 }}>₹{item.price}</p>
                  <p style={{ fontSize: 12, color: '#7c6fb8', marginBottom: 16 }}>📍 {item.college} • {item.condition}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate(`/listing/${item._id}`)} style={{ flex: 1, background: '#f0eeff', color: '#5a3ff5', border: 'none', borderRadius: 10, padding: '8px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>View</button>
                    <button onClick={() => deleteListing(item._id)} style={{ flex: 1, background: '#fff0f0', color: '#e53935', border: 'none', borderRadius: 10, padding: '8px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}