const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);