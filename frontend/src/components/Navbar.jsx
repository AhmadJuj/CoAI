import React, { useState, useEffect } from "react";
import { Search, User, Bell, Menu } from "lucide-react";
import { supabase } from "../supabaseClient";
export default function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("Signed out successfully");
      // Supabase onAuthStateChange listener in App.jsx will handle redirect
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
     <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-[#06B6D4]  px-4 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen?.(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-[#E2E8F0] hover:bg-[#1E293B] hover:text-blue-200 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-lg sm:text-xl font-bold text-blue-200">
                  DocHub
                </h1>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#E2E8F0]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#06B6D4] bg-[#1E293B] pl-10 pr-4 py-2 text-white placeholder-[#E2E8F0] focus:border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-opacity-50"
                  placeholder="Search documents..."
                />
              </div>
            </div>

            {/* Right side - Profile and Notifications */}
            <div className="flex items-center space-x-2 sm:space-x-4">
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
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-[#E2E8F0]">
                          {user?.email || 'No email'}
                        </p>
                      </div>
                     
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