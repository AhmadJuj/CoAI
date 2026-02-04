import React from "react";
import { Hash, User, X, MessageSquare, UserPlus, FileText } from "lucide-react";

export default function SidebarNav({ 
  selectedWorkspace, 
  setSelectedWorkspace, 
  workspaces, 
  loading, 
  setIsModalOpen,
  setIsJoinModalOpen,
  chatChannels,
  workspaceMembers, // ✅ Add this prop
  selectedChannel,
  setSelectedChannel,
  currentUser, // ✅ Add currentUser to access logged-in user info
  isSidebarOpen,
  setIsSidebarOpen,
  mobileView,
  onDocumentView
}) {
  
  // Handle DM click - create or fetch DM channel
  const handleDMClick = async (member) => {
    if (!currentUser || !selectedWorkspace) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('💬 Creating/fetching DM channel with:', member.name);
      
      const response = await fetch(`${apiUrl}/api/channels/dm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: selectedWorkspace._id,
          userId1: currentUser.id,
          userId2: member.userId,
          userName1: currentUser.name,
          userName2: member.name
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create/fetch DM channel');
      }
      
      const dmChannel = await response.json();
      console.log('✅ DM channel ready:', dmChannel);
      
      // Set the actual DM channel with real ID
      setSelectedChannel({
        id: dmChannel._id,
        name: member.name,
        type: 'dm',
        userId: member.userId
      });
      
      // Close sidebar on mobile after selecting DM
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('❌ Error creating DM channel:', error);
      alert('Failed to create DM channel');
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#0F172A] border-r border-[#06B6D4] overflow-y-auto z-40 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
      {!selectedWorkspace ? (
        // Workspaces Sidebar
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blue-200">Workspaces</h2>
            <button
              className="p-1 rounded text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              +
            </button>
            
            </div>
            <div>

                    <button
          onClick={() => setIsJoinModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 my-2 text-white rounded-lg hover:bg-blue-400 transition"
          >
          <UserPlus  />
          Join Workspace
        </button>

          </div>

          {loading ? (
            <div className="text-center text-[#E2E8F0] py-8">
              Loading workspaces...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-center text-[#94A3B8] py-8">
              <p>No workspaces yet</p>
              <p className="text-sm mt-2">Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workspaces.map((workspace) => (
                <button
                  key={workspace._id || workspace.id}
                  onClick={() => setSelectedWorkspace(workspace)}
                  className="w-full flex items-center p-3 rounded-lg bg-[#1E293B] hover:bg-[#334155] transition-colors group"
                >
                  <span className="text-2xl mr-3">{workspace.icon || "📂"}</span>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#E2E8F0] group-hover:text-blue-200">
                        {workspace.name}
                      </h3>
                      {workspace.unread > 0 && (
                        <span className="bg-[#06B6D4] text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {workspace.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#94A3B8]">
                      {workspace.members?.length || 0} members
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Chat Channels Sidebar
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-200">
                {selectedWorkspace.name}
              </h2>
              <button
                onClick={() => setSelectedWorkspace(null)}
                className="p-1 rounded text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-sm font-medium text-blue-200 mb-2">Channels</h3>
            <div className="space-y-1">
              {!chatChannels || chatChannels.length === 0 ? (
                <p className="text-sm text-[#94A3B8] px-2 py-1">Loading channels...</p>
              ) : chatChannels.filter((ch) => ch.type === "channel").length === 0 ? (
                <p className="text-sm text-[#94A3B8] px-2 py-1">No channels yet</p>
              ) : (
                chatChannels
                  .filter((ch) => ch.type === "channel")
                  .map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full flex items-center p-2 rounded text-left transition-colors ${
                        selectedChannel?.id === channel.id
                          ? "bg-[#06B6D4] text-black"
                          : "text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200"
                      }`}
                    >
                      <Hash className="h-4 w-4 mr-2" />
                      <span className="flex-1">{channel.name}</span>
                      {channel.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                          {channel.unread}
                        </span>
                      )}
                    </button>
                  ))
              )}

              {/* Documents Option */}
              <button
                onClick={() => {
                  if (onDocumentView && window.innerWidth < 1024) {
                    onDocumentView();
                    setIsSidebarOpen(false);
                  } else {
                    setSelectedChannel(null);
                  }
                }}
                className={`w-full flex items-center p-2 rounded text-left transition-colors ${
                  !selectedChannel
                    ? "bg-[#06B6D4] text-black"
                    : "text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200"
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="flex-1">Documents</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-blue-200 mb-2">
              Direct Messages
            </h3>
            <div className="space-y-1">
              {workspaceMembers && workspaceMembers.length > 0 ? (
                workspaceMembers.map((member) => (
                  <button
                    key={member.userId}
                    onClick={() => handleDMClick(member)}
                    className={`w-full flex items-center p-2 rounded text-left transition-colors ${
                      selectedChannel?.userId === member.userId
                        ? "bg-[#06B6D4] text-black"
                        : "text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200"
                    }`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="flex-1">{member.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-[#94A3B8] px-2 py-1">No other members yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}