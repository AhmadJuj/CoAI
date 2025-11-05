const express = require('express');
const router = express.Router();
const Message = require('../models/message.model.cjs');

// Get all messages for a channel
router.get('/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    
    // ✅ Convert to string to match storage format
    const messages = await Message.find({ channel: String(channelId) })
      .sort({ createdAt: 1 }) // Oldest first
      .limit(100); // Limit to last 100 messages
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { channelId, userId, userName, content } = req.body;
    
    const newMessage = new Message({
      channel: channelId,
      sender: userId,
      senderName: userName,
      content
    });
    
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

module.exports = router;