// models/document.model.cjs
const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema({
  title: { 
    type: String, 
    default: "Untitled",
    trim: true
  },
  content: { 
    type: mongoose.Schema.Types.Mixed, 
    default: "" 
  },
  workspace: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Workspace", 
    required: true,
    index: true
  },
  createdBy: { 
    type: String,  // ← MUST be String (Supabase UUID), NOT ObjectId!
    required: false 
  }
}, { 
  timestamps: true 
});

// Index for faster queries
DocSchema.index({ workspace: 1, updatedAt: -1 });

module.exports = mongoose.model("Doc", DocSchema);