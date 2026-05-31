const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Socket.io
const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('sendMessage', (data) => {
    const receiverSocket = onlineUsers.get(data.receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', data);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.forEach((val, key) => {
      if (val === socket.id) onlineUsers.delete(key);
    });
  });
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/payment', require('./routes/payment'));

app.get('/', (req, res) => {
  res.send('CampusBazaar Server is Running!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});