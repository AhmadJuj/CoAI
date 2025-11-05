const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  channel: { 
    type: String, // ✅ Changed to String to handle numeric IDs
    required: true 
  },
  sender: { 
    type: String, // Supabase user ID
    required: true 
  },
  senderName: { 
    type: String, // Store user name for quick access
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);