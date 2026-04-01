"use client";

import { useState, useCallback } from "react";
import FileTree from "@/components/FileTree";
import ChatPanel from "@/components/ChatPanel";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: Record<string, string>;
}

type Tab = "code" | "preview";
type Panel = "chat" | "code";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("code");
  const [activePanel, setActivePanel] = useState<Panel>("chat");

  const buildHistory = useCallback(() => {
    return messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
  }, [messages]);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          history: buildHistory(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
        return;
      }

      const newFiles = data.files || {};
      setFiles((prev) => ({ ...prev, ...newFiles }));

      const newFileKeys = Object.keys(newFiles);
      if (newFileKeys.length > 0) {
        setSelectedFile(newFileKeys[0]);
        setActiveTab("code");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "Done! Here's what I generated.",
          files: newFiles,
        },
      ]);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please check your API key and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, buildHistory]);

  const handleFileChange = useCallback(
    (content: string) => {
      if (!selectedFile) return;
      setFiles((prev) => ({ ...prev, [selectedFile]: content }));
    },
    [selectedFile]
  );

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-gray-100 overflow-hidden">
      <header className="flex-shrink-0 h-12 border-b border-gray-700/50 flex items-center px-4 gap-3 bg-[#0d1117]/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold">
            G
          </div>
          <span className="font-bold text-sm bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            GeminiCode
          </span>
        </div>
        <div className="h-4 w-px bg-gray-700" />
        <span className="text-xs text-gray-500">AI-Powered Code Generation</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex md:hidden gap-1 bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setActivePanel("chat")}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                activePanel === "chat" ? "bg-violet-600 text-white" : "text-gray-400"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActivePanel("code")}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                activePanel === "code" ? "bg-violet-600 text-white" : "text-gray-400"
              }`}
            >
              Code
            </button>
          </div>
          <div className="text-xs text-gray-600 hidden sm:block">
            {Object.keys(files).length} file{Object.keys(files).length !== 1 ? "s" : ""}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`flex-shrink-0 w-48 border-r border-gray-700/50 bg-[#161b22] overflow-hidden ${
            activePanel === "code" ? "flex" : "hidden"
          } md:flex flex-col`}
        >
          <FileTree files={files} selectedFile={selectedFile} onSelectFile={setSelectedFile} />
        </div>

        <div
          className={`flex-shrink-0 w-full md:w-96 border-r border-gray-700/50 bg-[#010409] overflow-hidden flex flex-col ${
            activePanel === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatPanel
            messages={messages}
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>

        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            activePanel === "code" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="flex-shrink-0 flex items-center border-b border-gray-700/50 bg-[#161b22] px-4 gap-1">
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "code"
                  ? "border-violet-500 text-violet-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "preview"
                  ? "border-violet-500 text-violet-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              Preview
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === "code" ? (
              selectedFile && files[selectedFile] !== undefined ? (
                <CodeEditor
                  filename={selectedFile}
                  content={files[selectedFile]}
                  onChange={handleFileChange}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-4xl mb-3">💻</div>
                    <p className="text-sm">No file selected</p>
                    <p className="text-xs mt-1">
                      {Object.keys(files).length === 0
                        ? "Generate code to get started"
                        : "Select a file from the explorer"}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <PreviewPanel files={files} selectedFile={selectedFile} />
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 h-6 bg-violet-900/30 border-t border-violet-800/30 flex items-center px-4 gap-4">
        <span className="text-xs text-violet-400/70">GeminiCode</span>
        <span className="text-xs text-gray-600">
          {isLoading ? "⟳ Generating..." : "● Ready"}
        </span>
        {selectedFile && (
          <span className="text-xs text-gray-600 ml-auto font-mono">{selectedFile}</span>
        )}
      </div>
    </div>
  );
}
