import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('https://campusjugaad-server.onrender.com/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWishlist(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (listingId) => {
    try {
      await axios.delete(`https://campusjugaad-server.onrender.com/api/wishlist/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWishlist(wishlist.filter(w => w.listing._id !== listingId))
      toast.success('Removed from wishlist!')
    } catch (err) {
      toast.error('Error removing from wishlist!')
    }
  }

  const categoryIcons = {
    Books: '📚', Electronics: '💻', Furniture: '🪑',
    Transport: '🚲', Stationery: '✏️'
  }

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#f7f5ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <nav style={{ background: '#fff', borderBottom: '1px solid #ede9ff', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>🎓 CampusJugaad</span>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: '#5a4fa3' }}>← Back</button>
      </nav>

      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 32px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>❤️ My Wishlist</h1>
        <p style={{ color: '#7c6fb8', marginBottom: 32 }}>Items you have saved</p>

        {loading ? (
          <p style={{ color: '#7c6fb8' }}>Loading...</p>
        ) : wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 48 }}>🤍</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#1a1035', marginTop: 16 }}>No saved items yet</p>
            <p style={{ color: '#7c6fb8', marginBottom: 24 }}>Browse listings and save items you like!</p>
            <button onClick={() => navigate('/')} style={{ background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 32px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>Browse Listings</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {wishlist.map(w => (
              <div key={w._id} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #ede9ff', overflow: 'hidden' }}>
                <div onClick={() => navigate(`/listing/${w.listing._id}`)}
                  style={{ background: w.listing.type === 'rent' ? '#fff3e0' : '#f0eeff', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, cursor: 'pointer', overflow: 'hidden' }}>
                  {w.listing.image ? (
                    <img src={w.listing.image} alt={w.listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    categoryIcons[w.listing.category] || '📦'
                  )}
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1035', marginBottom: 6 }}>{w.listing.title}</h3>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#5a3ff5', marginBottom: 8 }}>₹{w.listing.price}</p>
                  <p style={{ fontSize: 12, color: '#7c6fb8', marginBottom: 16 }}>📍 {w.listing.college}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate(`/listing/${w.listing._id}`)} style={{ flex: 1, background: '#f0eeff', color: '#5a3ff5', border: 'none', borderRadius: 10, padding: '8px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>View</button>
                    <button onClick={() => removeFromWishlist(w.listing._id)} style={{ flex: 1, background: '#fff0f0', color: '#e53935', border: 'none', borderRadius: 10, padding: '8px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Remove</button>
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