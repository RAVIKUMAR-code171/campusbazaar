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
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #1a0845, #3d1fa9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px', width: '100%', maxWidth: 420 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>Join CampusBazaar 🎓</h2>
        <p style={{ color: '#7c6fb8', marginBottom: 32 }}>Create your free student account</p>

        {error && <p style={{ color: 'red', marginBottom: 16, fontSize: 14 }}>{error}</p>}

        {[
          { label: 'Full Name', name: 'name', placeholder: 'Aryan Kumar', type: 'text' },
          { label: 'College Email', name: 'email', placeholder: 'aryan@dtu.ac.in', type: 'email' },
          { label: 'Password', name: 'password', placeholder: '••••••••', type: 'password' },
        ].map(field => (
          <div key={field.name} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>{field.label}</label>
            <input type={field.type} name={field.name} placeholder={field.placeholder} value={form[field.name]} onChange={handleChange}
              style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>College</label>
          <select name="college" value={form.college} onChange={handleChange}
            style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
            <option value="">Select your college</option>
            <option>IIT Delhi</option>
            <option>DTU</option>
            <option>NSUT</option>
            <option>GGSIPU</option>
            <option>Jamia Millia</option>
            <option>Other</option>
          </select>
        </div>

        <button onClick={handleRegister}
          style={{ width: '100%', background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
          Create Account
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#7c6fb8' }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#5a3ff5', fontWeight: 600, cursor: 'pointer' }}>Login</span>
        </p>
      </div>
    </div>
  )
}