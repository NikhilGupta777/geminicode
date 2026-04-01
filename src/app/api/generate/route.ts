import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are GeminiCode, an AI coding assistant similar to Replit Agent, Lovable, and Claude Code. 
Your job is to generate complete, working web applications based on user descriptions.

When generating code:
1. Always respond with a JSON object in this exact format:
{
  "message": "A brief description of what you built or changed",
  "files": {
    "filename.ext": "file content here",
    "another-file.ext": "another file content"
  }
}
2. Generate complete, functional code - no placeholders
3. For web apps, prefer single HTML files with embedded CSS and JS when possible
4. For React apps, create proper component files
5. Always include all necessary code to make the app work
6. The message should be friendly and explain what was built`;

export async function POST(request: NextRequest) {
  try {
    const { prompt, history } = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      return NextResponse.json({ 
        message: text, 
        files: {} 
      });
    }
    
    const parsed = JSON.parse(jsonMatch[1]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
