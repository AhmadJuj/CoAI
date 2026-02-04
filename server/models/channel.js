import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["channel", "dm"], default: "channel" },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  // For DMs, store the two participants
  participants: [{ type: String }] // Supabase user IDs for DMs
}, { timestamps: true });

export default mongoose.model("Channel", ChannelSchema);
