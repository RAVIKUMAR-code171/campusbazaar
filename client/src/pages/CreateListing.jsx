import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function CreateListing() {
  const [form, setForm] = useState({ title: '', description: '', price: '', type: 'sell', category: 'Books', condition: 'Good', college: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    try {
      setUploading(true)
      const token = localStorage.getItem('token')
      let imageUrl = ''

     if (image) {
        const formData = new FormData()
        formData.append('image', image)
        console.log('Uploading image...', image)
        const uploadRes = await axios.post('https://campusjugaad-server.onrender.com/api/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log('Upload result:', uploadRes.data)
        imageUrl = uploadRes.data.url
      }

      await axios.post('https://campusjugaad-server.onrender.com/api/listings', { ...form, image: imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Listing posted successfully! 🎉')
      navigate('/')
    } catch (err) {
      setError('Something went wrong. Are you logged in?')
      toast.error('Something went wrong. Are you logged in?')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#f7f5ff', padding: '40px 24px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', borderRadius: 24, padding: '40px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>Post a Listing 📦</h2>
        <p style={{ color: '#7c6fb8', marginBottom: 32 }}>Fill in the details below</p>

        {error && <p style={{ color: 'red', marginBottom: 16, fontSize: 14 }}>{error}</p>}

        {/* Image Upload */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>Photo of Item</label>
          <div onClick={() => document.getElementById('imageInput').click()}
            style={{ border: '2px dashed #d4ceff', borderRadius: 16, padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#f7f5ff' }}>
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 12, maxWidth: '100%' }} />
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                <p style={{ color: '#7c6fb8', fontSize: 14 }}>Click to upload a photo</p>
              </>
            )}
          </div>
          <input id="imageInput" type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        </div>

        {[
          { label: 'Title', name: 'title', placeholder: 'e.g. Engineering Mathematics Book', type: 'text' },
          { label: 'Price (₹)', name: 'price', placeholder: 'e.g. 250', type: 'number' },
          { label: 'College', name: 'college', placeholder: 'e.g. DTU', type: 'text' },
        ].map(field => (
          <div key={field.name} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>{field.label}</label>
            <input type={field.type} name={field.name} placeholder={field.placeholder} value={form[field.name]} onChange={handleChange}
              style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>Description</label>
          <textarea name="description" placeholder="Describe your item..." value={form.description} onChange={handleChange} rows={3}
            style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Type', name: 'type', options: ['sell', 'rent'] },
            { label: 'Category', name: 'category', options: ['Books', 'Electronics', 'Furniture', 'Transport', 'Stationery', 'Notes', 'Hostel Items', 'Calculators'] },
            { label: 'Condition', name: 'condition', options: ['Excellent', 'Good', 'Fair'] },
          ].map(field => (
            <div key={field.name}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#5a4fa3', display: 'block', marginBottom: 6 }}>{field.label}</label>
              <select name={field.name} value={form[field.name]} onChange={handleChange}
                style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 10px', fontFamily: 'Sora, sans-serif', fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                {field.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={uploading}
          style={{ width: '100%', background: uploading ? '#9b8fd4' : 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer' }}>
          {uploading ? '⏳ Uploading...' : '🚀 Post Listing'}
        </button>

        <button onClick={() => navigate('/')}
          style={{ width: '100%', background: 'transparent', border: '1.5px solid #d4ceff', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: '#5a4fa3', marginTop: 12 }}>
          Cancel
        </button>
      </div>
    </div>
  )
}