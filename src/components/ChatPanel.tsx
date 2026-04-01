"use client";

import { useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: Record<string, string>;
}

interface ChatPanelProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export default function ChatPanel({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-gray-200 mb-2">
              What would you like to build?
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Describe any web application, game, tool, or UI component and
              GeminiCode will generate it for you.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-sm">
              {[
                "Build a todo app with local storage",
                "Create a beautiful landing page",
                "Make a calculator with history",
                "Build a markdown previewer",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onInputChange(suggestion)}
                  className="text-left text-xs text-gray-400 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg px-3 py-2 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                G
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-tr-sm"
                  : "bg-gray-800/80 text-gray-200 rounded-tl-sm border border-gray-700/50"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              {msg.files && Object.keys(msg.files).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-600/50">
                  <p className="text-xs text-gray-400 mb-1">Generated files:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(msg.files).map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-mono"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                U
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs flex-shrink-0">
              G
            </div>
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex gap-2 bg-gray-800/80 border border-gray-700/50 rounded-xl p-2 focus-within:border-violet-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build... (Enter to send, Shift+Enter for newline)"
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 resize-none outline-none min-h-[40px] max-h-[160px] py-1 px-2"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={onSubmit}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-9 h-9 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors self-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          Powered by Gemini 1.5 Flash
        </p>
      </div>
    </div>
  );
}
