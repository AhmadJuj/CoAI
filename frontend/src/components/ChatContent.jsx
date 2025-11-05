import React, { useState, useEffect } from "react";
import { Hash, Users, Settings, Send } from "lucide-react";
import { useSocket } from "./SocketContext";

export default function ChatContent({ 
  selectedChannel,
  currentUser // ✅ Get from props instead of context
}) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  // Join channel when component mounts or channel changes
  useEffect(() => {
    if (!socket || !selectedChannel) return;

    // Load previous messages from database
    const loadMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/channel/${selectedChannel.id}`);
        const data = await response.json();
        
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
        console.log('📚 Loaded previous messages:', formattedMessages.length);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    // Join the channel room
    socket.emit('join-channel', selectedChannel.id);
    console.log('🚪 Joined channel:', selectedChannel.id);

    // Listen for incoming messages
    socket.on('receive-message', (messageData) => {
      console.log('📩 Received message:', messageData);
      
      setMessages((prevMessages) => [...prevMessages, {
        id: messageData.id || Date.now() + Math.random(),
        user: messageData.userName,
        message: messageData.message,
        time: new Date(messageData.timestamp || new Date()).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }]);
    });

    // Cleanup listener when channel changes
    return () => {
      socket.off('receive-message');
      // Don't clear messages - they'll be replaced when new channel loads
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

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#06B6D4] bg-[#0F172A] flex-shrink-0">
        <div className="flex items-center">
          <Hash className="h-5 w-5 mr-2 text-blue-200" />
          <h3 className="font-semibold text-blue-200">
            {selectedChannel.name}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors">
            <Users className="h-4 w-4" />
          </button>
          <button className="p-2 rounded text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-[#1E293B]">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-[#94A3B8] py-8">
              <p>No messages yet. Start the conversation! 💬</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#06B6D4] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-black">
                    {message.user[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-blue-200">
                      {message.user}
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-[#E2E8F0] break-words">{message.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-[#06B6D4] bg-[#0F172A] flex-shrink-0">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
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
              className="w-full resize-none rounded-lg border border-[#06B6D4] bg-[#1E293B] px-4 py-2 text-white placeholder-[#94A3B8] focus:border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-opacity-50 min-h-[40px] max-h-32"
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
            className="p-2 rounded-lg bg-[#06B6D4] text-black hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}