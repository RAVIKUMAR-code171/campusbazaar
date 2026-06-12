const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"CampusJugaad" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your CampusJugaad Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; background: #FFFAF4; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #C45C00; font-size: 28px; margin: 0;">🎓 CampusJugaad</h1>
          <p style="color: #8A6A50; margin-top: 8px;">Student Marketplace</p>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 32px; border: 1.5px solid #FFCF90; text-align: center;">
          <h2 style="color: #1A0C00; margin-bottom: 8px;">Verify Your Email</h2>
          <p style="color: #8A6A50; margin-bottom: 24px;">Use this OTP to verify your account:</p>
          <div style="background: #FFF0D0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; color: #C45C00; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #8A6A50; font-size: 13px;">This OTP expires in 10 minutes.</p>
          <p style="color: #8A6A50; font-size: 13px;">If you didn't request this, ignore this email.</p>
        </div>
        <p style="text-align: center; color: #8A6A50; font-size: 12px; margin-top: 24px;">© 2026 CampusJugaad. Built for students, by students.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };