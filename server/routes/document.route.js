import express from "express";
import Doc from "../models/document.model.js";
import Workspace from "../models/workspace.model.js";

const router = express.Router();

// Save or update a document
router.post("/save", async (req, res) => {
  try {
    const { id, content, title, workspace, createdBy } = req.body;

    console.log("Save request received:", { id, content: content?.length, title, workspace, createdBy });

    // Basic validation
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
        
    if (!workspace) {
      return res.status(400).json({ error: "Workspace is required" });
    }

    // Verify workspace exists
    const workspaceExists = await Workspace.findById(workspace);
    if (!workspaceExists) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    let doc;

    if (id) {
      // Update existing document
      doc = await Doc.findByIdAndUpdate(
        id,
        {
          title: title || "Untitled",
          content,
          workspace,
          createdBy
        },
        { new: true }
      );

      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
    } else {
      // Create new document
      const newDoc = new Doc({
        title: title || "Untitled",
        content,
        workspace,
        createdBy
      });
            
      doc = await newDoc.save();

      // Add document to workspace's docs array
      await Workspace.findByIdAndUpdate(
        workspace,
        { $addToSet: { docs: doc._id } }
      );
    }

    console.log("Document saved successfully:", doc._id);
    res.status(200).json(doc);
   
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// Get a document by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching document:", id);

    const doc = await Doc.findById(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(doc);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// Get all documents for a workspace
router.get("/workspace/:workspaceId", async (req, res) => {
  try {
    const { workspaceId } = req.params;
    console.log("Fetching documents for workspace:", workspaceId);

    const docs = await Doc.find({ workspace: workspaceId })
      .sort({ updatedAt: -1 }) // Most recently updated first
      .select("_id title content createdBy createdAt updatedAt");

    res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetching workspace documents:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// Delete a document
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting document:", id);

    const doc = await Doc.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Remove document from workspace's docs array
    await Workspace.findByIdAndUpdate(
      doc.workspace,
      { $pull: { docs: doc._id } }
    );

    await Doc.findByIdAndDelete(id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

export default router;
