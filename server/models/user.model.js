import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }]
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
