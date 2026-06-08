const express = require('express');
const router = express.Router();
const { register, login, verifyOTP } = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const user = JSON.stringify({ id: req.user._id, name: req.user.name, email: req.user.email, college: req.user.college });
      res.redirect(`https://campusjugaad.vercel.app/auth/success?token=${token}&user=${encodeURIComponent(user)}`);
    } catch (err) {
      res.redirect('https://campusjugaad.vercel.app/login');
    }
  }
);

module.exports = router;