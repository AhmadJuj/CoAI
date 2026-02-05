import React, { useState, useEffect, useRef } from "react";
import { Hash, Users, Settings, Send, Sparkles, ArrowLeft } from "lucide-react";
import { useSocket } from "./SocketContext";
import axios from "axios";

export default function ChatContent({ 
  selectedChannel,
  currentUser, // ✅ Get from props instead of context
  onGenerateDocument, // Callback to pass generated content to document editor
  onBack, // Callback to go back to sidebar on mobile
  isMobile // Whether this is mobile view
}) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join channel when component mounts or channel changes
  useEffect(() => {
    if (!socket || !selectedChannel) return;

    // Load previous messages from database
    const loadMessages = async () => {
      try {
        console.log('📥 Loading messages for channel:', selectedChannel.id, selectedChannel.name);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/messages/channel/${selectedChannel.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load messages: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📬 Raw messages data:', data);
        
        // Format messages for display
        const formattedMessages = data.map(msg => ({
          id: msg._id,
          user: msg.senderName,
          message: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));
        
        setMessages(formattedMessages);
        console.log('✅ Loaded previous messages:', formattedMessages.length);
      } catch (error) {
        console.error('❌ Error loading messages:', error);
        setMessages([]);
      }
    };

    loadMessages();

    // Join the channel room
    socket.emit('join-channel', selectedChannel.id);
    console.log('🚪 Joined channel:', selectedChannel.id);

    // Listen for incoming messages - filter by channel ID
    const handleReceiveMessage = (messageData) => {
      console.log('📩 Received message:', messageData, 'for channel:', selectedChannel.id);
      
      // Only add message if it's for the current channel
      if (messageData.channelId === selectedChannel.id) {
        setMessages((prevMessages) => [...prevMessages, {
          id: messageData.id || Date.now() + Math.random(),
          user: messageData.userName,
          message: messageData.message,
          time: new Date(messageData.timestamp || new Date()).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }]);
      } else {
        console.log('⏭️ Ignoring message from different channel:', messageData.channelId);
      }
    };
    
    socket.on('receive-message', handleReceiveMessage);

    // Cleanup: leave channel and remove listener when channel changes
    return () => {
      console.log('🚪 Leaving channel:', selectedChannel.id);
      socket.emit('leave-channel', selectedChannel.id);
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket, selectedChannel]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      channelId: selectedChannel.id,
      userName: currentUser?.name || 'Anonymous',
      userId: currentUser?.id || 'unknown',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    // Send message via socket
    socket.emit('send-message', messageData);
    
    // Clear input
    setNewMessage("");
  };

  const handleGenerateDocument = async () => {
    if (messages.length === 0) {
      alert('No messages to generate document from. Start chatting first!');
      return;
    }

    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/ai/generate-from-chat`, {
        channelId: selectedChannel.id
      });

      if (response.data.content) {
        // Pass generated content to parent (dashboard) to update document
        if (onGenerateDocument) {
          onGenerateDocument(response.data.content);
        }
        alert(`✨ Document generated from ${response.data.messageCount} messages!`);
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please check your Gemini API key in .env file.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1E293B]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#06B6D4] bg-[#0F172A] shrink-0">
        <div className="flex items-center min-w-0 gap-2">
          {isMobile && onBack && (
            <button 
              onClick={onBack}
              className="p-1.5 rounded text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200 flex-shrink-0" />
          <h3 className="font-semibold text-blue-200 text-sm sm:text-base truncate">
            {selectedChannel.name}
          </h3>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={handleGenerateDocument}
            disabled={isGenerating || messages.length === 0}
            className="px-2 sm:px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
            title="Generate document from chat using AI"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'AI Generate'}</span>
            <span className="sm:hidden">AI</span>
          </button>
          <button className="p-1.5 sm:p-2 rounded text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button className="p-1.5 sm:p-2 rounded text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors">
            <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-[#1E293B] min-h-0">
        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4 min-h-full flex flex-col justify-end">
          {messages.length === 0 ? (
            <div className="text-center text-[#94A3B8] py-8">
              <p>No messages yet. Start the conversation! 💬</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#06B6D4] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-black">
                      {message.user[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mb-1">
                      <span className="font-medium text-blue-200 text-sm sm:text-base">
                        {message.user}
                      </span>
                      <span className="text-[10px] sm:text-xs text-[#94A3B8]">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-[#E2E8F0] text-sm sm:text-base break-words overflow-wrap-anywhere">{message.message}</p>
                  </div>
                </div>
              ))}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-2 sm:p-4 border-t border-[#06B6D4] bg-[#0F172A] flex-shrink-0">
        <div className="flex items-end space-x-1.5 sm:space-x-2">
          <div className="flex-1 min-w-0">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Message ${selectedChannel?.name || ""}`}
              rows="1"
              className="w-full resize-none rounded-lg border border-[#06B6D4] bg-[#1E293B] px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base text-white placeholder-[#94A3B8] focus:border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-opacity-50 min-h-[40px] max-h-32"
              style={{ height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 sm:p-2.5 rounded-lg bg-[#06B6D4] text-black hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}