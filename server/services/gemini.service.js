import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate or improve document content based on chat messages
 */
export async function generateDocumentFromChat(chatMessages, existingDocument = null) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Format chat messages into context
    const chatContext = chatMessages
      .map(msg => `${msg.senderName}: ${msg.content}`)
      .join('\n');

    let prompt;
    
    if (existingDocument && existingDocument.content) {
      // Improve existing document
      prompt = `You are a professional document writer. Based on the following chat conversation, improve and enhance the existing document. 
      
Keep the original structure but:
- Add relevant information from the chat
- Improve clarity and coherence
- Fix any inconsistencies
- Maintain a professional tone

Chat Conversation:
${chatContext}

Existing Document:
${existingDocument.content}

Please provide the improved document content in HTML format (suitable for a rich text editor).`;
    } else {
      // Generate new document
      prompt = `You are a professional document writer. Based on the following chat conversation, create a well-structured, comprehensive document. 

Extract key information, insights, and discussions from the chat and organize them into a coherent document with:
- A clear structure with headings
- Well-formatted paragraphs
- Bullet points where appropriate
- Professional tone

Chat Conversation:
${chatContext}

Please provide the document content in HTML format (suitable for a rich text editor).`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating document with Gemini:', error);
    throw error;
  }
}

/**
 * Improve existing document content
 */
export async function improveDocumentContent(content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a professional editor and writer. Please improve the following document by:
- Enhancing clarity and readability
- Fixing grammar and spelling errors
- Improving sentence structure
- Adding better formatting where needed
- Maintaining the original meaning and tone

Document:
${content}

Please provide the improved document content in HTML format, preserving the existing HTML structure.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error improving document with Gemini:', error);
    throw error;
  }
}
