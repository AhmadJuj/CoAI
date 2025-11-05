// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true }, // Supabase UUID
  name: { type: String }, 
  avatarUrl: { type: String },
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
  role: { type: String, enum: ["admin", "member"], default: "member" }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
