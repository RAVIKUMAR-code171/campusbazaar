import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://campusjugaad-server.onrender.com/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #1a0845, #3d1fa9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px', width: '100%', maxWidth: 420 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>Welcome back 👋</h2>
        <p style={{ color: '#7c6fb8', marginBottom: 32 }}>Login to your CampusBazaar account</p>
        
        {error && <p style={{ color: 'red', marginBottom: 16, fontSize: 14 }}>{error}</p>}
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="aryan@dtu.ac.in"
            style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        
        <button onClick={handleLogin}
          style={{ width: '100%', background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
          Login
        </button>
        
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#7c6fb8' }}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#5a3ff5', fontWeight: 600, cursor: 'pointer' }}>Register</span>
        </p>
      </div>
    </div>
  )
}