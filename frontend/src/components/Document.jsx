import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Sparkles } from "lucide-react";
import axios from "axios";

export default function Document({ selectedWorkspace, userId, generatedContent }) {
  const [docId, setDocId] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);

  // Update content when AI generates new content from chat
  useEffect(() => {
    if (generatedContent) {
      setContent(generatedContent);
    }
  }, [generatedContent]);

  // Load documents for selected workspace
  useEffect(() => {
    if (!selectedWorkspace) {
      setLoading(false);
      return;
    }

    const fetchWorkspaceDocs = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/documents/workspace/${selectedWorkspace._id}`);
        setWorkspaceDocs(res.data);
        
        // Try to load last opened document for this workspace
        const savedDocId = localStorage.getItem(`currentDocId_${selectedWorkspace._id}`);
        if (savedDocId && res.data.some(d => d._id === savedDocId)) {
          loadDocument(savedDocId);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching workspace documents:", err);
        setLoading(false);
      }
    };

    fetchWorkspaceDocs();
  }, [selectedWorkspace]);

  // Load a specific document
  const loadDocument = async (id) => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/documents/${id}`);
      setContent(res.data.content || "");
      setDocId(id);
      localStorage.setItem(`currentDocId_${selectedWorkspace._id}`, id);
      console.log("Document loaded:", res.data.title);
    } catch (err) {
      console.error("Error fetching document:", err);
      if (err.response?.status === 404) {
        localStorage.removeItem(`currentDocId_${selectedWorkspace._id}`);
        setDocId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save document
  const handleSave = async () => {
    if (!selectedWorkspace) {
      alert("Please select a workspace first");
      return;
    }

    try {
      setSaving(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/documents/save`, {
        id: docId,
        content,
        title: "My Note",
        workspace: selectedWorkspace._id,
        createdBy: userId
      });

      const savedDocId = res.data._id;
      setDocId(savedDocId);
      localStorage.setItem(`currentDocId_${selectedWorkspace._id}`, savedDocId);
      
      // Refresh workspace documents list
      const docsRes = await axios.get(`${apiUrl}/api/documents/workspace/${selectedWorkspace._id}`);
      setWorkspaceDocs(docsRes.data);
      
      alert("✅ Document saved!");
    } catch (err) {
      console.error("Error saving document:", err);
      alert("❌ Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  // Create new document
  const handleNewDocument = () => {
    setDocId(null);
    setContent("");
    if (selectedWorkspace) {
      localStorage.removeItem(`currentDocId_${selectedWorkspace._id}`);
    }
  };

  // Delete document
  const handleDeleteDocument = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/documents/${id}`);
      
      // Refresh documents list
      const docsRes = await axios.get(`${apiUrl}/api/documents/workspace/${selectedWorkspace._id}`);
      setWorkspaceDocs(docsRes.data);
      
      // If deleted document was currently open, clear it
      if (docId === id) {
        setDocId(null);
        setContent("");
      }
      
      alert("✅ Document deleted!");
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("❌ Failed to delete document");
    }
  };

  // Improve document with AI
  const handleImproveDocument = async () => {
    if (!content || content.trim().length === 0) {
      alert("Please write some content first before improving!");
      return;
    }

    setImproving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/ai/improve-document`, {
        content
      });

      if (response.data.content) {
        setContent(response.data.content);
        alert("✨ Document improved with AI!");
      }
    } catch (err) {
      console.error("Error improving document:", err);
      alert("❌ Failed to improve document. Please check your Gemini API key.");
    } finally {
      setImproving(false);
    }
  };

  if (!selectedWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          Please select a workspace to view documents
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 p-6 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex gap-6 h-full">
        {/* Documents Sidebar */}
        <div className="w-64 flex-shrink-0 bg-slate-800 rounded-lg p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-lg">Documents</h3>
            <button
              onClick={handleNewDocument}
              className="p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors"
              title="New Document"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {workspaceDocs.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-8">
              No documents yet.<br />Create your first one!
            </div>
          ) : (
            <div className="space-y-2">
              {workspaceDocs.map(doc => (
                <div
                  key={doc._id}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                    docId === doc._id
                      ? 'bg-cyan-500 text-black'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  <div
                    onClick={() => loadDocument(doc._id)}
                    className="flex-1"
                  >
                    <div className="font-medium truncate">{doc.title}</div>
                    <div className={`text-xs mt-1 ${docId === doc._id ? 'text-black/70' : 'text-gray-400'}`}>
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc._id);
                    }}
                    className={`mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded ${
                      docId === doc._id
                        ? 'bg-black/20 hover:bg-black/30 text-black'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-white">
              <div className="text-sm text-gray-300">
                Workspace: <span className="font-semibold">{selectedWorkspace.icon} {selectedWorkspace.name}</span>
              </div>
              {docId && (
                <div className="text-xs text-gray-400 mt-1">
                  Document ID: {docId}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleImproveDocument}
                disabled={improving || loading || !content}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Improve document with AI"
              >
                <Sparkles className="h-4 w-4" />
                {improving ? "Improving..." : "AI Improve"}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg shadow hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : docId ? "Update" : "Save"}
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center text-blue-200 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500 mr-2"></div>
              <span>Loading editor...</span>
            </div>
          )}

          {/* Editor */}
          {!loading && (
            <div className="flex-1 min-h-0">
              <Editor
                apiKey="gt37owdw1ds6il5r2ztrk4uvdqwjbu0xwioput7cmo55xmpi"
                value={content}
                onEditorChange={(newValue) => setContent(newValue)}
                init={{
                  height: "100%",
                  menubar: false,
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  skin: "oxide-dark",
                  content_css: "dark",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}