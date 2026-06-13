import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

export default function ListingDetail() {
  const [listing, setListing] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    fetchListing()
    fetchReviews()
  }, [])

  const fetchListing = async () => {
    try {
      const res = await axios.get(`https://campusjugaad-server.onrender.com/api/listings/${id}`)
      setListing(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
  const handlePayment = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      setPaying(true)

      // Create order
      const orderRes = await axios.post('https://campusjugaad-server.onrender.com/api/payment/create-order', {
        amount: listing.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const order = orderRes.data

      // Open Razorpay popup
      const options = {
        key: 'rzp_test_SvnSryp6Akgcwx',
        amount: order.amount,
        currency: 'INR',
        name: 'CampusJugaad',
        description: listing.title,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post('https://campusjugaad-server.onrender.com/api/payment/verify', response, {
              headers: { Authorization: `Bearer ${token}` }
            })
            if (verifyRes.data.success) {
              alert('🎉 Payment successful! The seller will contact you soon.')
            }
          } catch (err) {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: '#5a3ff5'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      alert('Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  const handleWishlist = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      setWishlistLoading(true)
      if (wishlisted) {
        await axios.delete(`https://campusjugaad-server.onrender.com/api/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setWishlisted(false)
      } else {
        await axios.post(`https://campusjugaad-server.onrender.com/api/wishlist/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setWishlisted(true)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setWishlistLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`https://campusjugaad-server.onrender.com/api/reviews/${id}`)
      setReviews(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const submitReview = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      setSubmitting(true)
      await axios.post(`https://campusjugaad-server.onrender.com/api/reviews/${id}`, {
        rating,
        comment,
        seller: listing.seller._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setComment('')
      setRating(5)
      setReviewError('')
      fetchReviews()
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#f7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 18, color: '#5a4fa3' }}>Loading...</p>
    </div>
  )

  if (!listing) return (
    <div style={{ fontFamily: 'Sora, sans-serif', minHeight: '100vh', background: '#f7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 18, color: '#5a4fa3' }}>Listing not found</p>
    </div>
  )

  const categoryEmoji = {
    Books: '📚', Electronics: '💻', Furniture: '🪑', Transport: '🚲', Stationery: '✏️'
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#f7f5ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ede9ff', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>🎓 CampusJugaad</span>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '8px 20px', fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: '#5a4fa3' }}>← Back</button>
      </nav>

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>

          {/* Left — Image */}
          <div style={{ borderRadius: 24, overflow: 'hidden', minHeight: 320, border: '1.5px solid #ede9ff', background: listing.type === 'rent' ? '#fff3e0' : '#f0eeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {listing.image ? (
              <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 320 }} />
            ) : (
              <span style={{ fontSize: 120 }}>{categoryEmoji[listing.category] || '📦'}</span>
            )}
          </div>

          {/* Right — Details */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span style={{ background: listing.type === 'rent' ? '#fff3e0' : '#f0eeff', color: listing.type === 'rent' ? '#e65100' : '#5a3ff5', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, border: `1px solid ${listing.type === 'rent' ? '#ffcc80' : '#d4ceff'}` }}>
                {listing.type === 'rent' ? '🔑 FOR RENT' : '🛒 FOR SALE'}
              </span>
              <span style={{ background: '#f0eeff', color: '#5a3ff5', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>{listing.category}</span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>{listing.title}</h1>

            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>⭐</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1035' }}>{avgRating}</span>
                <span style={{ fontSize: 14, color: '#7c6fb8' }}>({reviews.length} reviews)</span>
              </div>
            )}

            <p style={{ fontSize: 36, fontWeight: 800, color: '#5a3ff5', marginBottom: 16 }}>₹{listing.price}{listing.type === 'rent' ? '/day' : ''}</p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 24 }}>{listing.description}</p>

            <div style={{ background: '#f7f5ff', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              {[
                ['Condition', listing.condition],
                ['College', listing.college],
                ['Seller', listing.seller?.name],
                ['Posted', new Date(listing.createdAt).toLocaleDateString()],
              ].map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ede9ff' }}>
                  <span style={{ color: '#7c6fb8', fontSize: 14 }}>{key}</span>
                  <span style={{ color: '#1a1035', fontSize: 14, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
            <button onClick={handlePayment} disabled={paying}
             style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
             {paying ? '⏳ Processing...' : '💳 Buy Now — ₹' + listing.price}
            </button>

           <button onClick={() => token ? navigate(`/chat/${listing._id}/${listing.seller._id}`) : navigate('/login')}
            style={{ width: '100%', background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
            💬 Chat with Seller
            </button>

            {token && listing.seller?.email && (
              <div style={{ background: '#FFFAF4', border: '1.5px solid #FFCF90', borderRadius: 14, padding: '16px 20px', marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: '#8A6A50', marginBottom: 8, fontWeight: 600 }}>📞 Contact Seller Directly</p>
                <p style={{ fontSize: 14, color: '#1A0C00' }}>📧 {listing.seller.email}</p>
                {listing.seller.phone && <p style={{ fontSize: 14, color: '#1A0C00', marginTop: 6 }}>📱 {listing.seller.phone}</p>}
              </div>
            )}
            <button onClick={handleWishlist}
              style={{ width: '100%', background: wishlisted ? '#fff0f0' : 'transparent', border: `1.5px solid ${wishlisted ? '#ffb3b3' : '#d4ceff'}`, borderRadius: 14, padding: '14px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 500, cursor: 'pointer', color: wishlisted ? '#e53935' : '#5a4fa3' }}>
              {wishlisted ? '❤️ Saved!' : '🤍 Save to Wishlist'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1.5px solid #ede9ff', marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1035', marginBottom: 24 }}>⭐ Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>

          {/* Write Review */}
          {token && user?.id !== listing.seller?._id && (
            <div style={{ background: '#f7f5ff', borderRadius: 16, padding: 24, marginBottom: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1035', marginBottom: 16 }}>Write a Review</h3>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => setRating(star)}
                    style={{ fontSize: 32, cursor: 'pointer', opacity: star <= rating ? 1 : 0.3 }}>
                    ⭐
                  </span>
                ))}
              </div>

              <textarea placeholder="Write your review here..." value={comment} onChange={e => setComment(e.target.value)} rows={3}
                style={{ width: '100%', border: '1.5px solid #d4ceff', borderRadius: 12, padding: '12px 16px', fontFamily: 'Sora, sans-serif', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />

              {reviewError && <p style={{ color: 'red', fontSize: 13, marginBottom: 12 }}>{reviewError}</p>}

              <button onClick={submitReview} disabled={submitting || !comment}
                style={{ background: 'linear-gradient(135deg, #5a3ff5, #9b5de5)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#7c6fb8' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>⭐</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1035' }}>No reviews yet</p>
              <p style={{ fontSize: 14, marginTop: 4 }}>Be the first to review this listing!</p>
            </div>
          ) : reviews.map(r => (
            <div key={r._id} style={{ borderBottom: '1px solid #ede9ff', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#1a1035', fontSize: 15 }}>{r.reviewer?.name}</span>
                  <span style={{ color: '#7c6fb8', fontSize: 13, marginLeft: 8 }}>{r.reviewer?.college}</span>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} style={{ fontSize: 16, opacity: star <= r.rating ? 1 : 0.2 }}>⭐</span>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{r.comment}</p>
              <p style={{ fontSize: 12, color: '#7c6fb8', marginTop: 4 }}>{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}