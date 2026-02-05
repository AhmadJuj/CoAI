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
  const [currentUser, setCurrentUser] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [chatChannels, setChatChannels] = useState([]); // ✅ Now dynamic
  const [workspaceMembers, setWorkspaceMembers] = useState([]); // ✅ Store workspace members
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar', 'chat', 'document'

  // Handle channel selection - switch to chat view on mobile
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setMobileView('chat');
    setIsSidebarOpen(false);
  };

  // Handle document view - switch to document view on mobile
  const handleDocumentView = () => {
    setMobileView('document');
    setIsSidebarOpen(false);
  };

  // Handle back to sidebar
  const handleBackToSidebar = () => {
    setMobileView('sidebar');
  };

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
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
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

  const handleWorkspaceDelete = async (workspaceId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete workspace');
      }

      // Remove from local state
      setWorkspaces((prev) => prev.filter(w => w._id !== workspaceId));
      
      // If deleted workspace was selected, clear selection
      if (selectedWorkspace?._id === workspaceId) {
        setSelectedWorkspace(null);
        setSelectedChannel(null);
        setChatChannels([]);
        setWorkspaceMembers([]);
      }

      console.log('✅ Workspace deleted successfully');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      alert(error.message || 'Failed to delete workspace. Please try again.');
    }
  };

  // ✅ Fetch workspace channels and members when a workspace is selected
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!selectedWorkspace) {
        setChatChannels([]);
        setWorkspaceMembers([]);
        setSelectedChannel(null);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        console.log('📡 Fetching channels for workspace:', selectedWorkspace._id);
        
        // Fetch channels for this workspace
        const channelsResponse = await fetch(
          `${apiUrl}/api/channels/workspace/${selectedWorkspace._id}`
        );
        
        if (!channelsResponse.ok) {
          throw new Error(`Failed to fetch channels: ${channelsResponse.status}`);
        }
        
        const channelsData = await channelsResponse.json();
        console.log('📚 Channels fetched:', channelsData);
        
        // Format channels for the UI
        const formattedChannels = channelsData.map(ch => ({
          id: ch._id,
          name: ch.name,
          type: ch.type,
          unread: 0,
          messages: []
        }));
        
        console.log('✅ Formatted channels:', formattedChannels);
        setChatChannels(formattedChannels);
        
        // Set default to general channel if available
        const generalChannel = formattedChannels.find(ch => ch.name === 'general');
        if (generalChannel) {
          console.log('🎯 Setting general channel as selected:', generalChannel);
          setSelectedChannel(generalChannel);
        } else {
          console.warn('⚠️ No general channel found!');
        }
        
        // Fetch workspace members
        const membersResponse = await fetch(
          `${apiUrl}/api/workspaces/${selectedWorkspace._id}/members`
        );
        
        if (!membersResponse.ok) {
          throw new Error(`Failed to fetch members: ${membersResponse.status}`);
        }
        
        const membersData = await membersResponse.json();
        console.log('👥 Members data received:', membersData);
        
        // Members already have names from the backend
        const membersWithDetails = membersData.map(member => ({
          userId: member.userId,
          name: member.name,
          email: member.email,
          role: member.role,
          type: 'dm'
        }));
        
        console.log('✅ Members with details:', membersWithDetails);
        
        // Filter out current user from DM list
        const otherMembers = membersWithDetails.filter(m => m.userId !== userId);
        setWorkspaceMembers(otherMembers);
        
      } catch (error) {
        console.error('Error fetching workspace data:', error);
      }
    };

    fetchWorkspaceData();
  }, [selectedWorkspace, userId]);

  // Handle AI-generated document content from chat
  const handleGenerateDocument = (content) => {
    setGeneratedContent(content);
    // Switch to document view
    setSelectedChannel(null);
  };

  return (
    <div className="flex h-screen bg-[#1E293B]">
      {/* Navbar */}
      <Navbar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Sidebar Navigation */}
      <SidebarNav
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
        workspaces={workspaces}
        loading={loading}
        setIsModalOpen={setIsModalOpen}
        setIsJoinModalOpen={setIsJoinModalOpen}
        chatChannels={chatChannels}
        workspaceMembers={workspaceMembers}
        selectedChannel={selectedChannel}
        setSelectedChannel={handleChannelSelect}
        currentUser={currentUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        mobileView={mobileView}
        onDocumentView={handleDocumentView}
        onWorkspaceDelete={handleWorkspaceDelete}
        userId={userId}
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
      <div className="flex-1 lg:ml-64 flex flex-col h-[calc(100vh-4rem)] mt-16 overflow-hidden">
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
        ) : (
          <>
            {/* Mobile Chat View */}
            <div className={`${mobileView === 'chat' ? 'flex' : 'hidden'} lg:hidden flex-col h-full overflow-hidden`}>
              {selectedChannel && (
                <ChatContent 
                  selectedChannel={selectedChannel}
                  currentUser={currentUser}
                  onGenerateDocument={(content) => setGeneratedContent(content)}
                  onBack={handleBackToSidebar}
                  isMobile={true}
                />
              )}
            </div>

            {/* Mobile Document View */}
            <div className={`${mobileView === 'document' ? 'flex' : 'hidden'} lg:hidden flex-col h-full overflow-hidden`}>
              <Document 
                selectedWorkspace={selectedWorkspace}
                userId={userId}
                generatedContent={generatedContent}
                currentUser={currentUser}
                onBack={handleBackToSidebar}
                isMobile={true}
              />
            </div>

            {/* Desktop View */}
            {selectedChannel ? (
              <div className="hidden lg:flex flex-1 h-full overflow-hidden">
                <ChatContent 
                  selectedChannel={selectedChannel}
                  currentUser={currentUser}
                  onGenerateDocument={(content) => setGeneratedContent(content)}
                  isMobile={false}
                />
              </div>
            ) : (
              <div className="hidden lg:flex flex-1 h-full overflow-hidden">
                <Document 
                  selectedWorkspace={selectedWorkspace}
                  userId={userId}
                  generatedContent={generatedContent}
                  currentUser={currentUser}
                  isMobile={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}