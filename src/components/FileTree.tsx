"use client";

interface FileTreeProps {
  files: Record<string, string>;
  selectedFile: string | null;
  onSelectFile: (filename: string) => void;
}

function getFileIcon(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html": return "🌐";
    case "css": return "🎨";
    case "js": return "⚡";
    case "ts": return "🔷";
    case "tsx": return "⚛️";
    case "jsx": return "⚛️";
    case "json": return "📋";
    case "md": return "📝";
    case "py": return "🐍";
    case "rs": return "🦀";
    case "go": return "🐹";
    default: return "📄";
  }
}

export default function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  const fileList = Object.keys(files);

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700/50">
        Explorer
      </div>
      {fileList.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-600 px-4">
            <div className="text-3xl mb-2">📁</div>
            <p className="text-xs">No files yet</p>
            <p className="text-xs mt-1">Start chatting to generate code</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-1">
          {fileList.map((filename) => (
            <button
              key={filename}
              onClick={() => onSelectFile(filename)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors hover:bg-gray-700/50 ${
                selectedFile === filename
                  ? "bg-violet-500/20 text-violet-300 border-l-2 border-violet-500"
                  : "text-gray-300 border-l-2 border-transparent"
              }`}
            >
              <span className="text-base flex-shrink-0">{getFileIcon(filename)}</span>
              <span className="truncate font-mono text-xs">{filename}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
