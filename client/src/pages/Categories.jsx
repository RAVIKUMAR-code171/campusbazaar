import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const C = {
  bg: '#FFFAF4', surface: '#ffffff', border: '#FFCF90',
  primary: '#FF9B3A', text: '#1A0C00', muted: '#8A6A50',
  accent: '#C45C00', card: '#ffffff'
}

const categoryIcons = {
  Books: '📚', Electronics: '💻', Furniture: '🪑',
  Transport: '🚲', Stationery: '✏️', Notes: '📝',
  'Hostel Items': '🏠', Calculators: '🧮'
}

export default function Categories() {
  const [listings, setListings] = useState([])
  const [selected, setSelected] = useState('Books')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchListings() }, [])

  const fetchListings = async () => {
    try {
      const res = await axios.get('https://campusjugaad-server.onrender.com/api/listings')
      setListings(res.data)
      setLoading(false)
    } catch (err) {
      toast.error('Failed to load listings!')
      setLoading(false)
    }
  }

  const filtered = listings.filter(l => l.category === selected)

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: C.bg, minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 20, fontWeight: 800, color: C.accent, cursor: 'pointer' }}>🎓 CampusJugaad</span>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', color: C.muted }}>← Back</button>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 8 }}>Browse by Category</h1>
        <p style={{ color: C.muted, marginBottom: 32 }}>Find exactly what you are looking for</p>

        {/* Category Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 40 }}>
          {Object.entries(categoryIcons).map(([cat, icon]) => (
            <div key={cat} onClick={() => setSelected(cat)}
              style={{ background: selected === cat ? C.primary : C.card, borderRadius: 16, padding: '20px 12px', textAlign: 'center', cursor: 'pointer', border: `1.5px solid ${selected === cat ? C.primary : C.border}`, transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: selected === cat ? '#fff' : C.text }}>{cat}</div>
            </div>
          ))}
        </div>

        {/* Listings */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 20 }}>
          {categoryIcons[selected]} {selected}
          <span style={{ fontSize: 15, fontWeight: 500, color: C.muted, marginLeft: 10 }}>{filtered.length} items</span>
        </h2>

        {loading ? (
          <p style={{ color: C.muted }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: C.text, marginTop: 16 }}>No listings in this category yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {filtered.map(item => (
              <div key={item._id} onClick={() => navigate(`/listing/${item._id}`)}
                style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ background: '#FFE8C8', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, overflow: 'hidden' }}>
                  {item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : categoryIcons[item.category] || '📦'}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>₹{item.price}</p>
                  <p style={{ fontSize: 12, color: C.muted }}>📍 {item.college}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}