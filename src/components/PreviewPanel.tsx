"use client";

interface PreviewPanelProps {
  files: Record<string, string>;
  selectedFile: string | null;
}

export default function PreviewPanel({ files, selectedFile }: PreviewPanelProps) {
  // Find the best file to preview
  const htmlFile =
    Object.keys(files).find((f) => f.endsWith(".html")) ||
    (selectedFile && selectedFile.endsWith(".html") ? selectedFile : null);

  let previewContent = "";
  if (htmlFile && files[htmlFile]) {
    previewContent = files[htmlFile];
  } else if (selectedFile && files[selectedFile]) {
    // Wrap CSS in a basic HTML page for preview
    const ext = selectedFile.split(".").pop()?.toLowerCase();
    if (ext === "css") {
      previewContent = `<!DOCTYPE html><html><head><style>${files[selectedFile]}</style></head><body><p style="font-family:sans-serif;padding:20px;color:#aaa">CSS Preview</p></body></html>`;
    } else {
      previewContent = "";
    }
  }

  if (!previewContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-3">🖥️</div>
          <p className="text-sm">No HTML file to preview</p>
          <p className="text-xs mt-1">Generate an HTML file to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-gray-400 ml-2">
          {htmlFile || "Preview"}
        </span>
      </div>
      <div className="flex-1">
        <iframe
          srcDoc={previewContent}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
      </div>
    </div>
  );
}
