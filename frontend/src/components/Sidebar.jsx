import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import CreateWorkspaceModal from "./createWorkSpaceModal";
import JoinWorkspaceModal from "./JoinWorkspaceModal";
import Document from "./Document";
import Navbar from "./Navbar";
import SidebarNav from "./side";
import ChatContent from "./ChatContent";

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // ✅ Add this
  const [generatedContent, setGeneratedContent] = useState(null); // For AI-generated content

  // Fetch Supabase user and workspaces on mount
  useEffect(() => {
    const fetchUserAndWorkspaces = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user:", userError);
          setLoading(false);
          return;
        }

        if (user) {
          setUserId(user.id);
          
          // ✅ Set current user with name
          setCurrentUser({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email
          });
          
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const url = `${apiUrl}/api/workspaces?userId=${user.id}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Expected JSON but got:', text.substring(0, 200));
            throw new Error('Server returned non-JSON response');
          }

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setWorkspaces(data);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndWorkspaces();
  }, []);

  const handleWorkspaceCreated = (workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
  };

  const handleWorkspaceJoined = (workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
    setSelectedWorkspace(workspace);
  };

  // Sample chat channels
  const chatChannels = [
    {
      id: 1,
      name: "general",
      type: "channel",
      unread: 0,
      messages: [],
    },
    {
      id: 3,
      name: "Alice Johnson",
      type: "dm",
      unread: 0,
      messages: [],
    },
    { id: 4, name: "Bob Smith", type: "dm", unread: 0, messages: [] },
  ];

  const [selectedChannel, setSelectedChannel] = useState(chatChannels[0]);

  // Handle AI-generated document content from chat
  const handleGenerateDocument = (content) => {
    setGeneratedContent(content);
    // Switch to document view
    setSelectedChannel(null);
  };

  return (
    <div className="flex h-screen bg-[#1E293B]">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar Navigation */}
      <SidebarNav
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
        workspaces={workspaces}
        loading={loading}
        setIsModalOpen={setIsModalOpen}
        setIsJoinModalOpen={setIsJoinModalOpen}
        chatChannels={chatChannels}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleWorkspaceCreated}
      />

      {/* Join Workspace Modal */}
      <JoinWorkspaceModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoined={handleWorkspaceJoined}
        userId={userId}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col h-[calc(100vh-4rem)] mt-16">
        {!selectedWorkspace ? (
          // Default view when no workspace is selected
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                Welcome to DocHub
              </h2>
              <p className="text-[#E2E8F0] mb-8">
                Select a workspace to start collaborating
              </p>
            </div>
          </div>
        ) : selectedChannel ? (
          // ✅ Chat interface - pass currentUser
          <ChatContent
            selectedChannel={selectedChannel}
            currentUser={currentUser}
            onGenerateDocument={handleGenerateDocument}
          />
        ) : (
          <Document 
            selectedWorkspace={selectedWorkspace} 
            userId={userId}
            generatedContent={generatedContent}
          />
        )}
      </div>
    </div>
  );
}