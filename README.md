# GeminiCode

GeminiCode is an AI-powered code generation web application that lets you build web apps by describing them in natural language. Powered by Google's Gemini 1.5 Flash model.

## Features

- **AI Chat Interface** – Describe what you want to build and GeminiCode generates it
- **Real-time Code Generation** – Instantly generates complete, working code files
- **File Explorer** – Browse all generated files in a sidebar
- **Code Editor** – View and edit generated code with line numbers and tab support
- **Live HTML Preview** – Preview generated HTML applications directly in the browser
- **Multi-turn Conversation** – Refine and iterate on your app through conversation
- **Mobile Responsive** – Works on both desktop and mobile with a panel toggle

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Gemini AI** (`gemini-1.5-flash`)

## Prerequisites

- Node.js 18+
- A Google Gemini API key

## Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd geminicode
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Copy the example env file and add your key:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and replace `your_key_here` with your actual API key.

## Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Type a description of what you want to build in the chat input (e.g., "Build a todo app with local storage")
2. Press **Enter** or click the send button
3. GeminiCode will generate the code and display it in the file explorer
4. Click any file in the explorer to view its code in the editor
5. Switch to the **Preview** tab to see a live preview of HTML files
6. Edit the code directly in the editor
7. Continue the conversation to refine or add features

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key (required) |
