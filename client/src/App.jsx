// CampusJugaad v2
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateListing from './pages/CreateListing'
import ListingDetail from './pages/ListingDetail'
import MyListings from './pages/MyListings'
import Requests from './pages/Requests'
import Wishlist from './pages/Wishlist'
import Categories from './pages/Categories'
import Chatbot from './Chatbot'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import AboutUs from './pages/AboutUs'
import AuthSuccess from './pages/AuthSuccess'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat/:listingId/:otherUserId" element={<Chat />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Routes>
      </BrowserRouter>
      <Chatbot />
    </div>
  )
}

export default App