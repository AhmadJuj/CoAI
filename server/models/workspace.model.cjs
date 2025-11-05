// models/workspace.model.cjs
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  password: { type: String, required: true },
  members: [
    {
      user: { type: String, required: true }, // Supabase user ID
      role: { 
        type: String, 
        enum: ["owner", "admin", "editor", "viewer"], 
        default: "editor" 
      }
    }
  ],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  docs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doc" }]
}, { timestamps: true });

// Hash password before save
WorkspaceSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);