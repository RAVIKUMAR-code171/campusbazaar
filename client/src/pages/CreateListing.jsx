import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function CreateListing() {
  const [aiLoading, setAiLoading] = useState(false)

  const generateWithAI = async () => {
    if (!form.title) return toast.error('Enter item name first!')
    setAiLoading(true)
    try {
      const response = await fetch('https://campusjugaad-server.onrender.com/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title })
      })
      const parsed = await response.json()
      setForm(f => ({ ...f, title: parsed.title, description: parsed.description }))
      toast.success('AI generated your listing! ✨')
    } catch (err) {
      toast.error('AI generation failed. Try again!')
    }
    setAiLoading(false)
  }

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
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#f5ecd8', padding: '40px 24px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', borderRadius: 24, padding: '40px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#7b5a2d', marginBottom: 8 }}>Post a Listing 📦</h2>
        <p style={{ color: '#8a6a50', marginBottom: 32 }}>Fill in the details below</p>

        {error && <p style={{ color: 'red', marginBottom: 16, fontSize: 14 }}>{error}</p>}

        {/* Image Upload */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#8a6a50', display: 'block', marginBottom: 6 }}>Photo of Item</label>
          <div onClick={() => document.getElementById('imageInput').click()}
            style={{ border: '2px dashed #FFCF90', borderRadius: 16, padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#F5ECD8' }}>
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 12, maxWidth: '100%' }} />
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                <p style={{ color: '#8a6a50', fontSize: 14 }}>Click to upload a photo</p>
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
            <label style={{ fontSize: 13, fontWeight: 600, color: '#8a6a50', display: 'block', marginBottom: 6 }}>{field.label}</label>
            <input type={field.type} name={field.name} placeholder={field.placeholder} value={form[field.name]} onChange={handleChange}
              style={{ width: '100%', border: '1.5px solid #ffcf90', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}

        <div style={{ marginBottom: 16 }}>
          <button type="button" onClick={generateWithAI}
            style={{ width: '100%', background: aiLoading ? '#ccc' : 'linear-gradient(135deg, #7B5A2D, #9C6B3C)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
            {aiLoading ? '✨ Generating...' : '✨ Generate with AI'}
          </button>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#8A6A50', display: 'block', marginBottom: 6 }}>Description</label>
          <textarea name="description" placeholder="Describe your item..." value={form.description} onChange={handleChange} rows={3}
            style={{ width: '100%', border: '1.5px solid #ffcf90', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Type', name: 'type', options: ['sell', 'rent'] },
            { label: 'Category', name: 'category', options: ['Books', 'Electronics', 'Furniture', 'Transport', 'Stationery', 'Notes', 'Hostel Items', 'Calculators'] },
            { label: 'Condition', name: 'condition', options: ['Excellent', 'Good', 'Fair'] },
          ].map(field => (
            <div key={field.name}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#8a6a50', display: 'block', marginBottom: 6 }}>{field.label}</label>
              <select name={field.name} value={form[field.name]} onChange={handleChange}
                style={{ width: '100%', border: '1.5px solid #ffcf90', borderRadius: 12, padding: '12px 10px', fontFamily: 'Sora, sans-serif', fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                {field.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={uploading}
          style={{ width: '100%', background: uploading ? '#ccc' : 'linear-gradient(135deg, #7b5a2d, #9c6b3c)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer' }}>
          {uploading ? '⏳ Uploading...' : '🚀 Post Listing'}
        </button>

        <button onClick={() => navigate('/')}
          style={{ width: '100%', background: 'transparent', border: '1.5px solid #ffcf90', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: '#8a6a50', marginTop: 12 }}>
          Cancel
        </button>
      </div>
    </div>
  )
}