import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    try {
      const res = await axios.post('https://campusjugaad-server.onrender.com/api/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#FFFAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ textAlign: 'center', marginBottom: 32, cursor: 'pointer' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: '#C45C00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>🎓</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#C45C00' }}>CampusJugaad</span>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '36px', border: '1.5px solid #FFCF90' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1A0C00', marginBottom: 6 }}>Join CampusJugaad 🎓</h2>
          <p style={{ color: '#8A6A50', marginBottom: 28, fontSize: 14 }}>Create your free student account</p>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffb3b3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c00' }}>
              {error}
            </div>
          )}

          {[
            { label: 'Full Name', name: 'name', placeholder: 'Ravi Kumar', type: 'text' },
            { label: 'College Email', name: 'email', placeholder: 'ravi@glbajaj.ac.in', type: 'email' },
            { label: 'Password', name: 'password', placeholder: '••••••••', type: 'password' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#8A6A50', display: 'block', marginBottom: 6 }}>{field.label}</label>
              <input type={field.type} name={field.name} placeholder={field.placeholder} value={form[field.name]} onChange={handleChange}
                style={{ width: '100%', border: '1.5px solid #FFCF90', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FFFAF4', color: '#1A0C00' }} />
            </div>
          ))}

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#8A6A50', display: 'block', marginBottom: 6 }}>College</label>
            <select name="college" value={form.college} onChange={handleChange}
              style={{ width: '100%', border: '1.5px solid #FFCF90', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', background: '#FFFAF4', color: '#1A0C00', boxSizing: 'border-box' }}>
              <option value="">Select your college</option>
              <option>IIT Delhi</option>
              <option>DTU</option>
              <option>NSUT</option>
              <option>GGSIPU</option>
              <option>Jamia Millia</option>
              <option>GL Bajaj Institute</option>
              <option>Other</option>
            </select>
          </div>

          <button onClick={handleRegister}
            style={{ width: '100%', background: '#C45C00', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
            Create Account →
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#8A6A50' }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#C45C00', fontWeight: 600, cursor: 'pointer' }}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}