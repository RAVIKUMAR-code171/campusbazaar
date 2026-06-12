import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' })
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1 = register form, 2 = OTP form
  const [userId, setUserId] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    try {
      setLoading(true)
      const res = await axios.post('https://campusjugaad-server.onrender.com/api/auth/register', form)
      setUserId(res.data.userId)
      setStep(2)
      setError('')
      toast.success('OTP sent to your email! 📧')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
      toast.error(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    try {
      setLoading(true)
      const res = await axios.post('https://campusjugaad-server.onrender.com/api/auth/verify-otp', { userId, otp })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Welcome to CampusJugaad! 🎉')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#F5ECD8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ textAlign: 'center', marginBottom: 32, cursor: 'pointer' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #8B6914, #C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>🎓</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#8B6914' }}>CampusJugaad</span>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '36px', border: '1.5px solid #E8DCC8' }}>

          {step === 1 ? (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1A0C00', marginBottom: 6 }}>Join CampusJugaad 🎓</h2>
              <p style={{ color: '#8A6A50', marginBottom: 28, fontSize: 14 }}>Create your free student account</p>

              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffb3b3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c00' }}>
                  {error}
                </div>
              )}

              <button onClick={() => window.location.href = 'https://campusjugaad-server.onrender.com/api/auth/google'}
                style={{ width: '100%', background: '#fff', color: '#1A0C00', border: '1.5px solid #E8DCC8', borderRadius: 14, padding: '14px', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, height: 18 }} />
                Continue with Google
              </button>

              <div style={{ textAlign: 'center', marginBottom: 16, color: '#8A6A50', fontSize: 13 }}>
                — or register with email —
              </div>

              {[
                { label: 'Full Name', name: 'name', placeholder: 'Ravi Kumar', type: 'text' },
                { label: 'College Email', name: 'email', placeholder: 'ravi@glbajaj.ac.in', type: 'email' },
                { label: 'Password', name: 'password', placeholder: '••••••••', type: 'password' },
              ].map(field => (
                <div key={field.name} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#8A6A50', display: 'block', marginBottom: 6 }}>{field.label}</label>
                  <input type={field.type} name={field.name} placeholder={field.placeholder} value={form[field.name]} onChange={handleChange}
                    style={{ width: '100%', border: '1.5px solid #E8DCC8', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FDFAF5', color: '#1A0C00' }} />
                </div>
              ))}

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#8A6A50', display: 'block', marginBottom: 6 }}>College</label>
                <select name="college" value={form.college} onChange={handleChange}
                  style={{ width: '100%', border: '1.5px solid #E8DCC8', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', background: '#FDFAF5', color: '#1A0C00', boxSizing: 'border-box' }}>
                  <option value="">Select your college</option>
                  <option>IIT Delhi</option>
                  <option>DTU</option>
                  <option>NSUT</option>
                  <option>GGSIPU</option>
                  <option>Jamia Millia</option>
                  <option>GL Bajaj Institute</option>
                  <option>BITS Pilani</option>
<option>NIT Trichy</option>
<option>VIT Vellore</option>
<option>Amity University</option>
<option>Bennett University</option>
<option>Sharda University</option>
<option>Other</option>
                </select>
              </div>

              <button onClick={handleRegister} disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #8B6914, #C9A84C)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Sending OTP...' : 'Create Account →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: '#8A6A50' }}>
                Already have an account?{' '}
                <span onClick={() => navigate('/login')} style={{ color: '#8B6914', fontWeight: 600, cursor: 'pointer' }}>
                  Login
                </span>
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1A0C00', marginBottom: 6 }}>Verify Email 📧</h2>
              <p style={{ color: '#8A6A50', marginBottom: 28, fontSize: 14 }}>We sent a 6-digit OTP to <strong>{form.email}</strong></p>

              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffb3b3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c00' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#8A6A50', display: 'block', marginBottom: 6 }}>Enter OTP</label>
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6}
                  style={{ width: '100%', border: '1.5px solid #E8DCC8', borderRadius: 12, padding: '16px', fontFamily: 'Sora, sans-serif', fontSize: 24, outline: 'none', boxSizing: 'border-box', background: '#FDFAF5', color: '#1A0C00', textAlign: 'center', letterSpacing: 8 }} />
              </div>

              <button onClick={handleVerifyOTP} disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #8B6914, #C9A84C)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Verifying...' : 'Verify OTP →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: '#8A6A50' }}>
                <span onClick={() => setStep(1)} style={{ color: '#8B6914', fontWeight: 600, cursor: 'pointer' }}>
                  ← Go back
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}