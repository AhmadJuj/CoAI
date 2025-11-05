import React, { useState, useEffect, useRef, useCallback } from 'react';

// Mock ReactQuill since we can't import it directly
// In a real app, you'd use: import ReactQuill from 'react-quill';
const ReactQuill = ({ value, onChange, modules, theme, placeholder, style }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    // Load Quill dynamically
    const loadQuill = async () => {
      // In a real React app, you'd have react-quill installed
      // For this demo, we'll create a simplified version
      if (window.Quill && !quillRef.current) {
        quillRef.current = new window.Quill(editorRef.current, {
          theme: theme || 'snow',
          modules: modules || {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['blockquote', 'code-block'],
              ['link'],
              ['clean']
            ]
          },
          placeholder: placeholder
        });

        if (value) {
          quillRef.current.root.innerHTML = value;
        }

        quillRef.current.on('text-change', () => {
          const html = quillRef.current.root.innerHTML;
          onChange && onChange(html);
        });
      }
    };

    // Load Quill if not already loaded
    if (!window.Quill) {
      const link = document.createElement('link');
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
      script.onload = loadQuill;
      document.body.appendChild(script);
    } else {
      loadQuill();
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  return <div ref={editorRef} style={style} />;
};

const DocumentEditor = () => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState('Document ready');
  const [status, setStatus] = useState('Ready to edit');
  const autoSaveIntervalRef = useRef(null);

  // Calculate word count
  const calculateWordCount = useCallback((html) => {
    const text = html.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
  }, []);

  // Handle content change
  const handleContentChange = useCallback((value) => {
    setContent(value);
    calculateWordCount(value);
    setStatus('Editing...');
  }, [calculateWordCount]);

  // Save document
  const saveDocument = useCallback(() => {
    // In a real app, you'd send this to your backend API
    localStorage.setItem('react-document-content', content);
    setLastSaved(`Saved at ${new Date().toLocaleTimeString()}`);
    setStatus('Saved');
    console.log('Document saved:', content);
  }, [content]);

  // Clear document
  const clearDocument = () => {
    if (window.confirm('Are you sure you want to clear the document? This action cannot be undone.')) {
      setContent('');
      setWordCount(0);
      setStatus('Document cleared');
      setLastSaved('Document cleared');
      localStorage.removeItem('react-document-content');
    }
  };

  // Export document
  const exportDocument = () => {
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Exported Document</title>
        <style>
          body { 
            font-family: Georgia, serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            color: #333;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setLastSaved('Document exported');
  };

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('react-document-content');
    if (savedContent) {
      setContent(savedContent);
      calculateWordCount(savedContent);
      setLastSaved('Document loaded from previous session');
    }
  }, [calculateWordCount]);

  // Auto-save setup
  useEffect(() => {
    if (content.trim().length > 0) {
      // Clear existing interval
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      
      // Set up new auto-save interval
      autoSaveIntervalRef.current = setInterval(() => {
        saveDocument();
      }, 30000); // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [content, saveDocument]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDocument();
      }
      
      // Ctrl/Cmd + E to export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportDocument();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveDocument]);

  const editorModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-blue-600">
              React Document Editor
            </h1>
            <div className="flex gap-2 justify-center sm:justify-end">
              <button
                onClick={exportDocument}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 transition-colors"
              >
                Export
              </button>
              <button
                onClick={clearDocument}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-red-500 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="relative">
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            modules={editorModules}
            theme="snow"
            placeholder="Start writing your document..."
            style={{ height: '500px' }}
          />
          
          {/* Word Count */}
          <div className="absolute bottom-4 right-6 bg-white bg-opacity-90 px-3 py-1 rounded-md text-xs text-gray-600 shadow-sm">
            {wordCount} words
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-between items-center text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{status}</span>
          </div>
          <div>{lastSaved}</div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="max-w-4xl mx-auto mt-4 text-center text-sm text-gray-500">
        <p>
          Keyboard shortcuts: <strong>Ctrl/Cmd + S</strong> to save, <strong>Ctrl/Cmd + E</strong> to export
        </p>
      </div>
    </div>
  );
};

export default DocumentEditor;