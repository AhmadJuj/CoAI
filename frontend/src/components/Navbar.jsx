import React, { useState } from "react";
import { Search, User, Bell, Menu } from "lucide-react";
import { supabase } from "../supabaseClient";
export default function Navbar() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("Signed out successfully");
      // Supabase onAuthStateChange listener in App.jsx will handle redirect
    }
  };
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [newMessage, setNewMessage] = useState("");
  
    // Sample workspaces data
    const workspaces = [
      { id: 1, name: "Design Team", icon: "🎨", members: 12, unread: 3 },
      { id: 2, name: "Development", icon: "💻", members: 8, unread: 7 },
      { id: 3, name: "Marketing", icon: "📈", members: 15, unread: 0 },
      { id: 4, name: "Project Alpha", icon: "🚀", members: 6, unread: 2 },
    ];
  
    const chatChannels = [
    {
      id: 1,
      name: "general",
      type: "channel",
      unread: 2,
      messages: [
        {
          id: 1,
          user: "Alice",
          message: "Hey everyone! How's the project going?",
          time: "10:30 AM",
        },
        {
          id: 2,
          user: "Bob",
          message: "Making good progress on the frontend",
          time: "10:32 AM",
        },
        {
          id: 3,
          user: "You",
          message: "Great! I'll have the backend ready by EOD",
          time: "10:35 AM",
        },
      ],
    },
   
    {
      id: 3,
      name: "Alice Johnson",
      type: "dm",
      unread: 1,
      messages: [
        {
          id: 1,
          user: "Alice",
          message: "Can we schedule a quick call?",
          time: "2:45 PM",
        },
      ],
    },
    { id: 4, name: "Bob Smith", type: "dm", unread: 0, messages: [] },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
 const [selectedChannel, setSelectedChannel] = useState(chatChannels[0]);
  return (
     <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-[#06B6D4]  px-4 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-200">
                  {selectedWorkspace ? selectedWorkspace.name : "DocHub"}
                </h1>
              </div>
              {selectedWorkspace && (
                <button
                  onClick={() => {
                    setSelectedWorkspace(null);
                    setSelectedChannel(chatChannels[0]); // reset channel
                  }}
                  className="ml-4 p-1 rounded text-[#E2E8F0] hover:text-blue-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#E2E8F0]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#06B6D4] bg-[#1E293B] pl-10 pr-4 py-2 text-white placeholder-[#E2E8F0] focus:border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-opacity-50"
                  placeholder={
                    selectedWorkspace
                      ? "Search in workspace..."
                      : "Search documents..."
                  }
                />
              </div>
            </div>

            {/* Right side - Profile and Notifications */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200 transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center p-2 rounded-lg text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-opacity-50"
                >
                  <User className="h-6 w-6" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-[#06B6D4] rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-[#1E293B]">
                        <p className="text-sm font-medium text-blue-200">
                          John Doe
                        </p>
                        <p className="text-xs text-[#E2E8F0]">
                          john@example.com
                        </p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200 transition-colors">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200 transition-colors">
                        My Documents
                      </button>
                      <hr className="border-[#1E293B] my-1" />
                       <button
        onClick={handleSignOut}
        className="w-full text-left px-4 py-2 text-sm text-[#E2E8F0] hover:bg-[#1E293B] hover:text-red-400 transition-colors"
      >
        Sign Out
      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
}