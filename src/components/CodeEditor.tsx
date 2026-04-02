"use client";

import { useRef } from "react";

interface CodeEditorProps {
  filename: string;
  content: string;
  onChange: (content: string) => void;
}

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js": return "javascript";
    case "ts": return "typescript";
    case "tsx": return "tsx";
    case "jsx": return "jsx";
    case "html": return "html";
    case "css": return "css";
    case "json": return "json";
    case "md": return "markdown";
    case "py": return "python";
    default: return "plaintext";
  }
}

export default function CodeEditor({ filename, content, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = content.substring(0, start) + "  " + content.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col font-mono">
      {/* File tab */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700/50 bg-gray-800/30">
        <div className="w-2 h-2 rounded-full bg-violet-500" />
        <span className="text-xs text-gray-300">{filename}</span>
        <span className="ml-auto text-xs text-gray-500">{getLanguage(filename)}</span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex min-h-full">
          {/* Line numbers */}
          <div className="select-none text-right pr-4 pl-3 py-4 text-xs text-gray-600 border-r border-gray-700/30 min-w-[3rem] flex-shrink-0">
            {content.split("\n").map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 bg-transparent text-gray-300 text-xs leading-6 py-4 px-4 outline-none resize-none font-mono w-full"
          />
        </div>
      </div>
    </div>
  );
}
