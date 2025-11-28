# Gemini AI Integration Setup Guide

## 🤖 AI Features Added

Your collaborative platform now has powerful AI capabilities powered by Google's Gemini AI:

### 1. **AI Generate from Chat** 📝
- Button location: Chat header (purple gradient button with sparkles icon)
- Functionality: Reads all messages in the current channel and generates a well-structured document
- Use case: Convert team discussions into organized documentation

### 2. **AI Improve Document** ✨
- Button location: Document editor header (purple gradient button)
- Functionality: Enhances existing document content with better clarity, grammar, and formatting
- Use case: Polish your documents with AI-powered improvements

## 🔧 Setup Instructions

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure Environment Variables

#### Frontend (.env in root directory)
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

#### Backend (server/.env)
```env
MONGO_URI=mongodb://127.0.0.1:27017/mydb
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://mudsmruncvpvouusgtrx.supabase.co
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:** Replace `your_actual_gemini_api_key_here` with your real API key!

### Step 3: Restart Your Servers

After adding the API keys, restart both frontend and backend:

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📚 How to Use

### Generate Document from Chat

1. **Start a conversation** in any channel
2. Have a discussion with your team (the more context, the better!)
3. Click the **"AI Generate"** button in the chat header
4. The AI will:
   - Read all messages in the channel
   - Extract key information and insights
   - Create a well-structured document
   - Automatically switch to the document editor with the generated content
5. Click **"Save"** to persist the document

### Improve Existing Document

1. **Open or create a document** in the editor
2. Write or paste your content
3. Click the **"AI Improve"** button in the document header
4. The AI will:
   - Analyze your content
   - Fix grammar and spelling
   - Improve sentence structure
   - Enhance readability
   - Return the improved version
5. Click **"Save"** to keep the improvements

## 🎨 UI Enhancements

- **Purple gradient buttons** indicate AI-powered features
- **Sparkles icon** (✨) represents AI functionality
- **Loading states**: Buttons show "Generating..." or "Improving..." during processing
- **Disabled states**: Buttons are disabled when no content is available

## 🔒 Security Notes

- API keys are stored in `.env` files (already in `.gitignore`)
- Never commit `.env` files to version control
- Each user should have their own API key for production use
- Consider implementing rate limiting for production deployments

## 🐛 Troubleshooting

### "Failed to generate document" Error
- ✅ Check if your Gemini API key is correct in `.env` files
- ✅ Verify both frontend and backend are running
- ✅ Check browser console for detailed error messages
- ✅ Ensure you have messages in the chat before generating

### "No messages to generate from" Alert
- ✅ Send at least one message in the chat channel first
- ✅ Refresh the page if messages aren't showing

### API Key Issues
- ✅ Ensure no extra spaces or quotes in the `.env` file
- ✅ Restart both servers after adding the API key
- ✅ Verify the API key is active in Google AI Studio

## 📦 New Files Added

```
frontend/
  └── src/
      └── utils/
          └── geminiService.js          # Frontend AI service

server/
  ├── services/
  │   └── gemini.service.cjs            # Backend AI service
  └── routes/
      └── ai.route.cjs                  # AI API endpoints

.env                                    # Frontend environment variables
server/.env                             # Backend environment variables (updated)
```

## 🔄 Modified Files

- `frontend/src/components/ChatContent.jsx` - Added AI Generate button
- `frontend/src/components/Document.jsx` - Added AI Improve button  
- `frontend/src/components/Sidebar.jsx` - Added state management for AI features
- `server/server.cjs` - Registered AI routes

## 🚀 API Endpoints

### POST `/api/ai/generate-from-chat`
Generate document from chat messages
```json
{
  "channelId": "string",
  "documentId": "string (optional)"
}
```

### POST `/api/ai/improve-document`
Improve existing document content
```json
{
  "content": "string"
}
```

## 💡 Tips for Best Results

1. **For Document Generation:**
   - Have meaningful conversations with context
   - Include specific details and information
   - Discuss structured topics (meeting notes, project plans, etc.)

2. **For Document Improvement:**
   - Provide complete sentences and paragraphs
   - Include enough content for the AI to work with
   - Run multiple improvements for iterative refinement

## 📝 Future Enhancements

Consider these additional features:
- [ ] AI summarization of long documents
- [ ] Auto-suggest document titles based on content
- [ ] AI-powered chat responses
- [ ] Document templates generation
- [ ] Multi-language support
- [ ] Custom AI prompts and instructions

## 🆘 Support

If you encounter any issues:
1. Check the console logs in both browser and terminal
2. Verify all environment variables are set correctly
3. Ensure MongoDB and Supabase connections are working
4. Test the Gemini API key independently

---

**Enjoy your AI-powered collaborative platform! 🎉**
