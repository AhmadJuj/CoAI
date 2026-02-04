import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

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
import workspaceRoutes from "./routes/workspace.route.js";
app.use("/api/workspaces", workspaceRoutes);

import documentRoutes from './routes/document.route.js';
app.use('/api/documents', documentRoutes);

import messageRoutes from './routes/message.route.js';
app.use('/api/messages', messageRoutes);

import aiRoutes from './routes/ai.route.js';
app.use('/api/ai', aiRoutes);

import channelRoutes from './routes/channel.route.js';
app.use('/api/channels', channelRoutes);

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

import Message from './models/message.model.js';

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // When a user joins a channel
  socket.on('join-channel', (channelId) => {
    const channelRoom = String(channelId);
    socket.join(channelRoom);
    console.log(`👤 User ${socket.id} joined channel room: ${channelRoom}`);
  });

  // When a user leaves a channel
  socket.on('leave-channel', (channelId) => {
    const channelRoom = String(channelId);
    socket.leave(channelRoom);
    console.log(`🚪 User ${socket.id} left channel room: ${channelRoom}`);
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
      
      // Add the saved message data with timestamp and channelId
      const messageToSend = {
        id: newMessage._id.toString(),
        channelId: String(messageData.channelId), // Include channelId for filtering
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
        channelId: String(messageData.channelId),
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
