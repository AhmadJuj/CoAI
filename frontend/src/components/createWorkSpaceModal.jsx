import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { supabase } from "../supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
export default function CreateWorkspaceModal({ isOpen, onClose, onCreated }) {
 async function getSupabaseUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user?.id || null; // returns UUID or null if not logged in
}
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🚀");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      setError("You must be logged in to create a workspace.");
      setLoading(false);
      return;
    }

    const workspaceData = {
      name,
      description,
      icon,
      password,
      userId: user.id,
      userName: user.user_metadata?.name || user.email || 'User',
      userEmail: user.email
    };

    console.log('📤 Sending workspace data:', workspaceData);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await axios.post(`${apiUrl}/api/workspaces`, workspaceData);

    onCreated(res.data);

    // Reset form
    setName("");
    setDescription("");
    setIcon("🚀");
    setPassword("");

    onClose();
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || "Failed to create workspace");
  } finally {
    setLoading(false);
  }
};


  const handleClose = () => {
    // Reset form when closing
    setName("");
    setDescription("");
    setIcon("🚀");
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E293B] rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-200">
            Create Workspace
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-[#0F172A] text-white border border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Design Team"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 rounded bg-[#0F172A] text-white border border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this workspace about?"
              rows="3"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              className="w-full p-2 rounded bg-[#0F172A] text-white border border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secure password"
              required
              disabled={loading}
              minLength={6}
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum 6 characters
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Icon (emoji)
            </label>
            <input
              type="text"
              className="w-20 p-2 rounded bg-[#0F172A] text-white border border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] text-center text-xl"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🚀"
              maxLength={2}
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-600 text-white rounded p-2 hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#06B6D4] text-black rounded p-2 hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}