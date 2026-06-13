const Request = require('../models/Request');
const Notification = require('../models/Notification');

// Get all requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('postedBy', 'name college')
      .populate('responses.user', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create request
exports.createRequest = async (req, res) => {
  try {
    const { title, description, category, college, budget } = req.body;
    const request = new Request({
      title,
      description,
      category,
      college,
      budget,
      postedBy: req.user.id
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to request
exports.respondToRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    request.responses.push({
      user: req.user.id,
      message: req.body.message
    });
await request.save();

    // Send notification to request owner
    await Notification.create({
      recipient: request.postedBy,
      sender: req.user.id,
      type: 'request_response',
      message: `Someone responded to your request: "${request.title}"`,
      link: '/requests'
    });

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await request.deleteOne();
    res.status(200).json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};