import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const C = {
  bg: '#f8f9ff',
  surface: '#ffffff',
  border: '#e2e8f0',
  navBg: '#0f1c3f',
  heroBg: '#0f1c3f',
  primary: '#c9a84c',
  light: '#ffffff',
  text: '#1e293b',
  muted: '#64748b',
  accent: '#c9a84c',
  card: '#ffffff',
  darkCard: '#162040'
}

const categoryIcons = {
  Books: '📚', Electronics: '💻', Furniture: '🪑',
  Transport: '🚲', Stationery: '✏️', Notes: '📝',
  'Hostel Items': '🏠', Calculators: '🧮'
}

export default function Home() {
  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => { fetchListings() }, [])

  const fetchListings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/listings')
      setListings(res.data)
    } catch (err) { console.log(err) }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filtered = listings.filter(l => {
    const matchType = type === 'all' || l.type === type
    const matchCat = category === 'All' || l.category === category
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCat && matchSearch
  })

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: C.bg, minHeight: '100vh', color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hov-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .hov-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .cat-btn:hover { background: ${C.primary} !important; color: ${C.bg} !important; }
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; }
          .grid-3 { grid-template-columns: 1fr 1fr !important; }
          .hide-mobile { display: none !important; }
          .hero-pad { padding: 48px 20px !important; }
          .nav-pad { padding: 0 20px !important; }
          .section-pad { padding: 0 20px !important; }
        }
        @media (max-width: 480px) {
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="nav-pad" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.light }}>CampusBazaar</span>
          </div>
          <div className="hide-mobile" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['Home', 'Browse', 'Borrow', 'Requests'].map(n => (
              <span key={n} onClick={() => {
                 if (n === 'Browse') document.getElementById('listings').scrollIntoView({ behavior: 'smooth' })
                 if (n === 'Requests') navigate('/requests')
              }}i din
                style={{ padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500, color: C.muted, cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = C.light} onMouseLeave={e => e.target.style.color = C.muted}>{n}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {token ? (
              <>
                <button onClick={() => navigate('/create')} className="hov-btn"
                  style={{ background: C.primary, color: C.bg, border: 'none', borderRadius: 12, padding: '8px 18px', fontFamily: 'Sora,sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  + Post
                </button>
                <button onClick={() => navigate('/my-listings')} className="hov-btn"
                  style={{ background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '8px 14px', fontFamily: 'Sora,sans-serif', fontWeight: 500, cursor: 'pointer', color: C.muted, fontSize: 14 }}>
                  My Listings
                </button>
                <button onClick={logout} className="hov-btn"
                  style={{ background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '8px 14px', fontFamily: 'Sora,sans-serif', fontWeight: 500, cursor: 'pointer', color: C.muted, fontSize: 14 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="hov-btn"
                  style={{ background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '8px 18px', fontFamily: 'Sora,sans-serif', fontWeight: 500, cursor: 'pointer', color: C.muted, fontSize: 14 }}>
                  Login
                </button>
                <button onClick={() => navigate('/register')} className="hov-btn"
                  style={{ background: C.primary, color: C.bg, border: 'none', borderRadius: 12, padding: '8px 18px', fontFamily: 'Sora,sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-pad" style={{ background: `linear-gradient(135deg, #0a1628 0%, #0f1c3f 50%, #162040 100%)`, padding: '80px 32px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(217,119,6,0.15)', border: `1px solid rgba(217,119,6,0.3)`, borderRadius: 999, padding: '6px 16px', marginBottom: 28 }}>
          <span style={{ color: C.primary, fontSize: 13, fontWeight: 600 }}>✦ Verified Students Only Marketplace</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 800, color: C.light, lineHeight: 1.15, marginBottom: 20 }}>
          Buy, Sell & Borrow<br />
          <span style={{ color: C.primary }}>Within Your Campus</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 18, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
          The exclusive marketplace for verified college students. Trade safely with your campus mates.
        </p>
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto 32px' }}>
          <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search books, laptops, furniture..."
            style={{ width: '100%', padding: '16px 20px 16px 50px', borderRadius: 16, border: `1.5px solid ${C.border}`, background: C.surface, color: C.text, fontFamily: 'Sora,sans-serif', fontSize: 15, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Books 📚', 'Laptops 💻', 'Cycles 🚲', 'Furniture 🪑'].map(tag => (
            <span key={tag} onClick={() => setSearch(tag.split(' ')[0])}
              style={{ background: 'rgba(217,119,6,0.1)', color: C.primary, borderRadius: 999, padding: '8px 18px', fontSize: 13, cursor: 'pointer', border: `1px solid rgba(217,119,6,0.25)`, fontWeight: 500 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          {[['12,400+', 'Students'], ['3,200+', 'Listings'], ['8', 'Colleges'], ['₹0', 'Commission']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>{val}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1200, margin: '64px auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(217,119,6,0.1)', color: C.primary, borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 700, marginBottom: 16, border: `1px solid rgba(217,119,6,0.2)` }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.light }}>Simple, Safe & Student-First</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            ['🔍', 'Browse', 'Find what you need from verified students in your college'],
            ['💬', 'Connect', 'Chat directly with the seller inside the platform'],
            ['🤝', 'Exchange', 'Meet on campus, verify the item, complete the trade'],
            ['⭐', 'Review', 'Rate your experience to build community trust'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: C.card, borderRadius: 20, padding: '28px 24px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.light, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: C.surface, padding: '64px 32px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.light, marginBottom: 8 }}>Discover by Category</h2>
          <p style={{ color: C.muted, marginBottom: 32 }}>Find exactly what you are looking for</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {Object.entries(categoryIcons).map(([cat, icon]) => (
              <div key={cat} className="cat-btn" onClick={() => { setCategory(cat); document.getElementById('listings').scrollIntoView({ behavior: 'smooth' }) }}
                style={{ background: C.card, borderRadius: 16, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${C.border}`, transition: 'all 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.light }}>{cat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Borrow Section */}
      <div style={{ maxWidth: 1200, margin: '64px auto', padding: '0 32px' }}>
        <div style={{ background: `linear-gradient(135deg, #2d1a0a, #3d2410)`, borderRadius: 24, padding: '48px', border: `1px solid ${C.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(217,119,6,0.15)', color: C.primary, borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>BORROW ECONOMY</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.light, marginBottom: 16 }}>Rent Per Day,<br />Save Big</h2>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>Need a calculator for one exam? Or a cycle for a week? Borrow from campus mates at affordable daily rates.</p>
            {['Save Money', 'Eco-friendly sharing', 'Community trust'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ color: C.primary, fontSize: 16 }}>✓</span>
                <span style={{ color: C.text, fontSize: 15 }}>{item}</span>
              </div>
            ))}
            <button onClick={() => { setType('rent'); document.getElementById('listings').scrollIntoView({ behavior: 'smooth' }) }} className="hov-btn"
              style={{ marginTop: 24, background: C.primary, color: C.bg, border: 'none', borderRadius: 14, padding: '14px 32px', fontFamily: 'Sora,sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
              Start Borrowing →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['🚲', 'Campus Cycle', '₹50/day'], ['💻', 'High-End Laptop', '₹500/day'], ['📚', 'Academic Books', '₹10/day'], ['🧮', 'Calculator', '₹5/day']].map(([icon, name, price]) => (
              <div key={name} style={{ background: C.card, borderRadius: 16, padding: '20px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.light, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div id="listings" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.light }}>
            {type === 'all' ? 'All Listings' : type === 'rent' ? 'Items to Borrow' : 'Items for Sale'}
            <span style={{ fontSize: 16, fontWeight: 500, color: C.muted, marginLeft: 12 }}>{filtered.length} items</span>
          </h2>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {[['all', 'All Items'], ['sell', '🛒 Buy'], ['rent', '🔑 Borrow']].map(([val, label]) => (
            <button key={val} onClick={() => setType(val)}
              style={{ padding: '8px 20px', borderRadius: 999, border: `1.5px solid ${type === val ? C.primary : C.border}`, background: type === val ? C.primary : 'transparent', color: type === val ? C.bg : C.muted, fontFamily: 'Sora,sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              {label}
            </button>
          ))}
          <div style={{ width: 1, background: C.border, margin: '0 4px' }} />
          {['All', 'Books', 'Electronics', 'Furniture', 'Transport', 'Stationery'].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: '8px 16px', borderRadius: 999, border: `1.5px solid ${category === cat ? C.primary : C.border}`, background: category === cat ? 'rgba(217,119,6,0.15)' : 'transparent', color: category === cat ? C.primary : C.muted, fontFamily: 'Sora,sans-serif', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: C.muted }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginTop: 16, color: C.light }}>No listings found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {filtered.map(item => (
              <div key={item._id} className="hov-card" onClick={() => navigate(`/listing/${item._id}`)}
                style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                <div style={{ background: item.type === 'rent' ? '#2d1a0a' : '#1a1535', height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative', overflow: 'hidden' }}>
                 {item.image ? (
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                ) : (
                 categoryIcons[item.category] || '📦'
                )}
                  <span style={{ position: 'absolute', top: 10, left: 10, background: item.type === 'rent' ? 'rgba(217,119,6,0.2)' : 'rgba(109,40,217,0.2)', color: item.type === 'rent' ? C.primary : '#a78bfa', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700, border: `1px solid ${item.type === 'rent' ? 'rgba(217,119,6,0.3)' : 'rgba(109,40,217,0.3)'}` }}>
                    {item.type === 'rent' ? '🔑 BORROW' : '🛒 BUY'}
                  </span>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.light, marginBottom: 6, lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginBottom: 8 }}>₹{item.price}{item.type === 'rent' ? '/day' : ''}</p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <span style={{ background: 'rgba(217,119,6,0.1)', color: C.primary, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{item.category}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: C.muted, borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{item.condition}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: C.muted }}>📍 {item.college}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>by {item.seller?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: C.surface, padding: '64px 32px', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: C.light, marginBottom: 12 }}>Got something to sell or rent? 💰</h2>
        <p style={{ color: C.muted, fontSize: 16, marginBottom: 32 }}>Post for free and reach thousands of students across multiple colleges.</p>
        <button onClick={() => token ? navigate('/create') : navigate('/register')} className="hov-btn"
          style={{ background: C.primary, color: C.bg, border: 'none', borderRadius: 16, padding: '16px 40px', fontFamily: 'Sora,sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 16 }}>
          {token ? 'Post a Listing — Free' : 'Join CampusBazaar — Free'}
        </button>
      </div>

      {/* Footer */}
      <footer style={{ background: '#140a02', padding: '40px 32px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.light, marginBottom: 8 }}>🎓 CampusBazaar</div>
            <p style={{ color: C.muted, fontSize: 14, maxWidth: 280, lineHeight: 1.6 }}>The exclusive marketplace for verified college students. Zero commission. Pure community.</p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {[['Marketplace', ['Browse', 'Post Listing', 'Borrow']], ['Company', ['About Us', 'Contact', 'Safety Tips']]].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</div>
                {links.map(l => <div key={l} style={{ fontSize: 14, color: C.muted, marginBottom: 8, cursor: 'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: 'center', color: C.muted, fontSize: 13 }}>
          © 2026 CampusBazaar. Built for students, by students.
        </div>
      </footer>
    </div>
  )
}