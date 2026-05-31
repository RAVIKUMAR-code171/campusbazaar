import { useNavigate } from 'react-router-dom'

export default function AboutUs() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#f7f5ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ede9ff', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>🎓 CampusBazaar</span>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: '#5a4fa3' }}>← Back</button>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0a1628, #0f1c3f)', padding: '80px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 16 }}>About <span style={{ color: '#c9a84c' }}>CampusBazaar</span></h1>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
          The exclusive marketplace built for college students, by college students.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '64px auto', padding: '0 32px' }}>

        {/* Mission */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 40, border: '1.5px solid #ede9ff', marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', marginBottom: 16 }}>Our Mission</h2>
          <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
            College life is expensive. We built CampusBazaar to help students buy, sell, and borrow items within their campus community — safely, easily, and for free.
          </p>
        </div>

        {/* Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
          {[
            ['🔒', 'Safe & Verified', 'Only verified college students can join. No strangers, no scams.'],
            ['💰', 'Zero Commission', 'We never take a cut. 100% of the money goes to the seller.'],
            ['🌱', 'Sustainable', 'Reusing items reduces waste and helps the environment.'],
            ['🤝', 'Community First', 'Built on trust between students who share the same campus.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1.5px solid #ede9ff', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1035', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#7c6fb8', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 40, border: '1.5px solid #ede9ff', marginBottom: 32, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>Built by a Student 👨‍💻</h2>
          <p style={{ color: '#7c6fb8', marginBottom: 32 }}>CampusBazaar was built by a college student who wanted to solve a real problem.</p>
          <div style={{ display: 'inline-block', background: '#f7f5ff', borderRadius: 20, padding: '24px 40px', border: '1.5px solid #ede9ff' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>👤</div>
           <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a1035', marginBottom: 4 }}>Ravi Kumar</h3>
           <p style={{ color: '#7c6fb8', fontSize: 14 }}>Founder & Developer</p>
           <p style={{ color: '#7c6fb8', fontSize: 13, marginTop: 8 }}>🎓 GL Bajaj Institute of Technology and Management</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', borderRadius: 24, padding: 40, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to join? 🚀</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>Join thousands of students already trading on CampusBazaar.</p>
          <button onClick={() => navigate('/register')}
            style={{ background: '#fff', color: '#5a3ff5', border: 'none', borderRadius: 14, padding: '14px 32px', fontFamily: 'Sora, sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 16 }}>
            Join CampusBazaar — Free
          </button>
        </div>
      </div>
    </div>
  )
}