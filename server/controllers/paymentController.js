const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_SvnSryp6Akgcwx',
  key_secret: 'xRAnbVgltv9auWpXE34naEjF'
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay uses paise (1 rupee = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const crypto = require('crypto');
   const hmac = crypto.createHmac('sha256', 'xRAnbVgltv9auWpXE34naEjF');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified!' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};