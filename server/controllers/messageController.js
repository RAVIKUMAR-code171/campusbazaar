const Message = require('../models/Message');

// Get messages between two users for a listing
exports.getMessages = async (req, res) => {
  try {
    const { listingId, otherUserId } = req.params;
    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id }
      ]
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .populate('sender', 'name college')
    .populate('receiver', 'name college')
    .populate('listing', 'title image')
    .sort({ createdAt: -1 });

    // Get unique conversations
    const conversations = [];
    const seen = new Set();
    messages.forEach(msg => {
      const otherId = msg.sender._id.toString() === req.user.id 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
      const key = `${msg.listing._id}-${otherId}`;
      if (!seen.has(key)) {
        seen.add(key);
        conversations.push(msg);
      }
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, listing, message } = req.body;
    const newMessage = new Message({
      sender: req.user.id,
      receiver,
      listing,
      message
    });
    await newMessage.save();
    const populated = await newMessage.populate('sender', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};