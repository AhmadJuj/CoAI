const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*", // In production, specify your frontend URL
    methods: ["GET", "POST"]
  }
});

// ✅ Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// ✅ Routes
const workspaceRoutes = require("./routes/workspace.route.cjs");
app.use("/api/workspaces", workspaceRoutes);

const documentRoutes = require('./routes/document.route.cjs');
app.use('/api/documents', documentRoutes);

const messageRoutes = require('./routes/message.route.cjs');
app.use('/api/messages', messageRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('🚀 MERN server is running');
});

// =============================================
// 🔥 SOCKET.IO CONNECTION HANDLING
// =============================================

const Message = require('./models/message.model.cjs');

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // When a user joins a channel
  socket.on('join-channel', (channelId) => {
    const channelRoom = String(channelId);
    socket.join(channelRoom);
    console.log(`👤 User ${socket.id} joined channel room: ${channelRoom}`);
  });

  // When a user sends a message
  socket.on('send-message', async (messageData) => {
    console.log('📨 Message received:', messageData);
    
    try {
      // Save message to database
      const newMessage = new Message({
        channel: String(messageData.channelId), // ✅ Ensure string
        sender: messageData.userId,
        senderName: messageData.userName,
        content: messageData.message
      });
      
      await newMessage.save();
      console.log('💾 Message saved to database with ID:', newMessage._id);
      
      // Add the saved message data with timestamp
      const messageToSend = {
        id: newMessage._id.toString(),
        userName: newMessage.senderName,
        message: newMessage.content,
        timestamp: newMessage.createdAt
      };
      
      const channelRoom = String(messageData.channelId);
      console.log('📡 Broadcasting to room:', channelRoom);
      
      // Broadcast message to all users in the channel (including sender)
      io.to(channelRoom).emit('receive-message', messageToSend);
      console.log('✅ Message broadcast complete');
      
    } catch (error) {
      console.error('❌ Error saving message:', error);
      // Still broadcast even if save fails (for real-time experience)
      const channelRoom = String(messageData.channelId);
      io.to(channelRoom).emit('receive-message', {
        id: Date.now().toString(),
        userName: messageData.userName,
        message: messageData.message,
        timestamp: new Date()
      });
    }
  });

  // When user disconnects
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// ✅ Start server (use 'server' instead of 'app')
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO is ready`);
});