// components/JoinWorkspaceModal.jsx
import React, { useState } from "react";
import { X, Search, Lock } from "lucide-react";

export default function JoinWorkspaceModal({ isOpen, onClose, onJoined, userId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a workspace name or ID");
      return;
    }

    setSearching(true);
    setError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/search?query=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);

      if (data.length === 0) {
        setError("No workspaces found");
      }
    } catch (err) {
      console.error("Error searching workspaces:", err);
      setError("Failed to search workspaces");
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = async () => {
    if (!password.trim()) {
      setError("Please enter the workspace password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${selectedWorkspace._id}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password, userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join workspace');
      }

      onJoined(data.workspace);
      handleClose();
    } catch (err) {
      console.error("Error joining workspace:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedWorkspace(null);
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E293B] rounded-lg p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedWorkspace ? "Enter Password" : "Join Workspace"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {!selectedWorkspace ? (
          // Search View
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Workspace
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter workspace name or ID"
                  className="flex-1 px-4 py-2 bg-[#0F172A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searching ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Search size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((workspace) => (
                  <div
                    key={workspace._id}
                    onClick={() => setSelectedWorkspace(workspace)}
                    className="p-4 bg-[#0F172A] rounded-lg cursor-pointer hover:bg-[#1a2332] transition border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{workspace.icon || "📁"}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{workspace.name}</h3>
                        {workspace.description && (
                          <p className="text-sm text-gray-400">{workspace.description}</p>
                        )}
                      </div>
                      <Lock size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Password View
          <>
            <div className="mb-4 p-4 bg-[#0F172A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedWorkspace.icon || "📁"}</div>
                <div>
                  <h3 className="font-semibold text-white">{selectedWorkspace.name}</h3>
                  {selectedWorkspace.description && (
                    <p className="text-sm text-gray-400">{selectedWorkspace.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Workspace Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                placeholder="Enter password"
                className="w-full px-4 py-2 bg-[#0F172A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedWorkspace(null)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleJoin}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Joining...
                  </>
                ) : (
                  "Join Workspace"
                )}
              </button>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}