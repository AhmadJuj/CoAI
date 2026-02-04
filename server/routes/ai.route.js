import express from 'express';
import { generateDocumentFromChat, improveDocumentContent } from '../services/gemini.service.js';
import Message from '../models/message.model.js';
import Document from '../models/document.model.js';

const router = express.Router();

/**
 * POST /api/ai/generate-from-chat
 * Generate document from chat messages
 */
router.post('/generate-from-chat', async (req, res) => {
  try {
    const { channelId, documentId } = req.body;

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID is required' });
    }

    // Fetch chat messages for the channel
    const messages = await Message.find({ channel: channelId })
      .sort({ createdAt: 1 })
      .limit(100); // Limit to last 100 messages

    if (messages.length === 0) {
      return res.status(400).json({ error: 'No messages found in this channel' });
    }

    // Check if we should improve existing document
    let existingDocument = null;
    if (documentId) {
      existingDocument = await Document.findById(documentId);
    }

    // Generate/improve document using Gemini
    const generatedContent = await generateDocumentFromChat(messages, existingDocument);

    res.json({ 
      content: generatedContent,
      messageCount: messages.length,
      isImprovement: !!existingDocument
    });
  } catch (error) {
    console.error('Error generating document from chat:', error);
    res.status(500).json({ 
      error: 'Failed to generate document',
      message: error.message 
    });
  }
});

/**
 * POST /api/ai/improve-document
 * Improve existing document content
 */
router.post('/improve-document', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    // Improve document using Gemini
    const improvedContent = await improveDocumentContent(content);

    res.json({ 
      content: improvedContent
    });
  } catch (error) {
    console.error('Error improving document:', error);
    res.status(500).json({ 
      error: 'Failed to improve document',
      message: error.message 
    });
  }
});

export default router;
