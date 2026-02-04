import express from "express";
import Channel from "../models/channel.js";
import Workspace from "../models/workspace.model.js";
import mongoose from "mongoose";

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all channels for a workspace
router.get("/workspace/:workspaceId", async (req, res) => {
  try {
    const { workspaceId } = req.params;

    console.log('📡 Fetching channels for workspace:', workspaceId);

    if (!isValidObjectId(workspaceId)) {
      console.error('❌ Invalid workspace ID:', workspaceId);
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    const channels = await Channel.find({ workspace: workspaceId })
      .sort({ createdAt: 1 }); // Sort by creation time

    console.log('✅ Found channels:', channels.length, channels);
    res.json(channels);
  } catch (err) {
    console.error("❌ Error fetching channels:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create a channel in a workspace
router.post("/", async (req, res) => {
  try {
    const { name, type, workspaceId, participants } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    if (!isValidObjectId(workspaceId)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    // Verify workspace exists
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const channel = new Channel({
      name,
      type: type || "channel",
      workspace: workspaceId,
      participants: participants || []
    });

    await channel.save();

    // Add channel to workspace
    workspace.channels.push(channel._id);
    await workspace.save();

    res.json(channel);
  } catch (err) {
    console.error("Error creating channel:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get or create a DM channel between two users
router.post("/dm", async (req, res) => {
  try {
    const { workspaceId, userId1, userId2, userName1, userName2 } = req.body;

    if (!workspaceId || !userId1 || !userId2) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!isValidObjectId(workspaceId)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    console.log('🔍 Looking for DM channel between:', userId1, 'and', userId2);

    // Check if DM channel already exists between these two users
    const existingChannel = await Channel.findOne({
      workspace: workspaceId,
      type: "dm",
      participants: { $all: [userId1, userId2] }
    });

    if (existingChannel) {
      console.log('✅ Found existing DM channel:', existingChannel._id);
      return res.json(existingChannel);
    }

    // Create new DM channel
    console.log('📝 Creating new DM channel');
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const dmChannel = new Channel({
      name: `DM: ${userName1} & ${userName2}`,
      type: "dm",
      workspace: workspaceId,
      participants: [userId1, userId2]
    });

    await dmChannel.save();
    
    // Add channel to workspace
    workspace.channels.push(dmChannel._id);
    await workspace.save();

    console.log('✅ Created new DM channel:', dmChannel._id);
    res.json(dmChannel);
  } catch (err) {
    console.error("Error creating/finding DM channel:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
