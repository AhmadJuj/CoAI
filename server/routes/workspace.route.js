import express from "express";
import Workspace from "../models/workspace.model.js";
import Channel from "../models/channel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

// Create workspace
router.post("/", async (req, res) => {
  try {
    const { name, description, icon, password, userId, userName, userEmail } = req.body;

    console.log('📝 Creating workspace with data:', { name, userId, userName, userEmail });

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const workspace = new Workspace({
      name,
      description,
      icon,
      password,
      members: [{ 
        user: userId, 
        userName: userName || 'User',
        userEmail: userEmail,
        role: "owner" 
      }],
    });

    console.log('💾 Saving workspace with member:', workspace.members[0]);

    await workspace.save();

    console.log('✅ Workspace created:', workspace._id);

    // ✅ Create default "general" channel for the workspace
    const generalChannel = new Channel({
      name: "general",
      type: "channel",
      workspace: workspace._id,
      participants: []
    });

    await generalChannel.save();
    console.log('✅ General channel created:', generalChannel._id);

    // Add channel to workspace
    workspace.channels.push(generalChannel._id);
    await workspace.save();
    console.log('✅ Channel added to workspace. Total channels:', workspace.channels.length);

    res.json(workspace);
  } catch (err) {
    console.error("Error creating workspace:", err);
    res.status(500).json({ error: err.message });
  }
});

// Search workspaces by name, description, or ID
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Trim whitespace
    const searchQuery = query.trim();

    if (searchQuery.length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters" });
    }

    // Build search conditions
    const searchConditions = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ];

    // Only add ID search if the query is a valid ObjectId
    if (isValidObjectId(searchQuery)) {
      searchConditions.push({ _id: searchQuery });
    }

    // Search using $or with all conditions
    const workspaces = await Workspace.find({
      $or: searchConditions
    })
    .select('_id name description icon')
    .limit(50) // Limit results
    .sort({ name: 1 }); // Sort by name alphabetically

    res.json(workspaces);
  } catch (err) {
    console.error("Error searching workspaces:", err);
    res.status(500).json({ error: "Failed to search workspaces" });
  }
});

// Join workspace with password
router.post("/:id/join", async (req, res) => {
  try {
    const { password, userId, userName, userEmail } = req.body;
    const workspaceId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    // Validate workspace ID
    if (!isValidObjectId(workspaceId)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, workspace.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Check if user is already a member
    const isMember = workspace.members.some(
      m => m.user.toString() === userId.toString()
    );

    if (isMember) {
      return res.status(400).json({ error: "You are already a member of this workspace" });
    }

    // Add user as editor with their info
    workspace.members.push({ 
      user: userId, 
      userName: userName || 'User',
      userEmail: userEmail,
      role: "editor" 
    });
    await workspace.save();

    res.json({ 
      message: "Successfully joined workspace", 
      workspace 
    });
  } catch (err) {
    console.error("Error joining workspace:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all workspaces for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const workspaces = await Workspace.find({
      "members.user": userId
    }).sort({ updatedAt: -1 }); // Sort by most recently updated

    res.json(workspaces);
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get workspace by ID
router.get("/:id", async (req, res) => {
  try {
    const workspaceId = req.params.id;

    if (!isValidObjectId(workspaceId)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findById(workspaceId)
      .select('-password'); // Don't return password

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    res.json(workspace);
  } catch (err) {
    console.error("Error fetching workspace:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get workspace members with their details
router.get("/:id/members", async (req, res) => {
  try {
    const workspaceId = req.params.id;

    if (!isValidObjectId(workspaceId)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Return members with their stored info
    const members = workspace.members.map(member => {
      console.log('👤 Processing member:', member);
      return {
        userId: member.user,
        name: member.userName || member.userEmail || 'User',
        email: member.userEmail,
        role: member.role
      };
    });

    console.log('✅ Returning members:', members);
    res.json(members);
  } catch (err) {
    console.error("Error fetching workspace members:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
