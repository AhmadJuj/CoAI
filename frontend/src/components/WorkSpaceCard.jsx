
import React, { useState } from "react";
import {
  User,
  MessageSquare,
  Hash,
  Users,
  Settings,
  X,
  Send,
  Trash2,
} from "lucide-react";

// ============================================
// Individual Component Files Below
// ============================================

// WorkspaceCard.jsx
const WorkspaceCard = ({ workspace, onClick, onDelete, userRole }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    if (onDelete) {
      await onDelete(workspace._id);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={onClick}
        className="w-full flex items-center p-3 rounded-lg bg-[#1E293B] hover:bg-[#334155] transition-colors group"
      >
        <span className="text-2xl mr-3">{workspace.icon}</span>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[#E2E8F0] group-hover:text-blue-200">
              {workspace.name}
            </h3>
            <div className="flex items-center gap-2">
              {workspace.unread > 0 && (
                <span className="bg-[#06B6D4] text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {workspace.unread}
                </span>
              )}
              {userRole === 'owner' && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete workspace"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-[#94A3B8]">{workspace.members?.length || 0} members</p>
        </div>
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={cancelDelete}>
          <div className="bg-[#1E293B] rounded-lg p-6 max-w-md mx-4 border border-red-500/50" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-red-400 mb-4">Delete Workspace?</h3>
            <p className="text-[#E2E8F0] mb-6">
              Are you sure you want to delete <span className="font-semibold text-blue-200">{workspace.name}</span>? 
              This action cannot be undone and will delete all channels and messages.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-[#334155] text-[#E2E8F0] hover:bg-[#475569] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WorkspaceCard;