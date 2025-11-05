
import React, { useState } from "react";
import {
  User,
  MessageSquare,
  Hash,
  Users,
  Settings,
  X,
  Send,
} from "lucide-react";

// ============================================
// Individual Component Files Below
// ============================================

// WorkspaceCard.jsx
const WorkspaceCard = ({ workspace, onClick }) => (
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
        {workspace.unread > 0 && (
          <span className="bg-[#06B6D4] text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {workspace.unread}
          </span>
        )}
      </div>
      <p className="text-sm text-[#94A3B8]">{workspace.members} members</p>
    </div>
  </button>
);
export default WorkspaceCard;