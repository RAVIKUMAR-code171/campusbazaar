import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const user = params.get('user')

    if (token && user) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', user)
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#FFFAF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ fontSize: 18, color: '#C45C00', fontWeight: 600 }}>Logging you in...</p>
      </div>
    </div>
  )
}