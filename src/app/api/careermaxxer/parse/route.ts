import { NextResponse } from 'next/server';
import * as pdfParse from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL required' }, { status: 400 });
    }

    // 1. Fetch PDF content
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) throw new Error("Failed to fetch PDF");
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Extract Text
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text.slice(0, 30000); // Limit context window

    const systemPrompt = `
      You are a elite career coach. Analyze the provided RESUME text.
      Output a valid JSON object with:
      {
        "skills": ["Skill 1", "Skill 2", "Skill 3"],
        "seniority_level": "Junior | Mid-Level | Senior | Lead",
        "missing_skills": ["Critical Skill 1", "Critical Skill 2"],
        "summary": "Professional summary (max 2 sentences)",
        "score": 75 (0-100 employability score)
      }
      Assume the target role is 'Senior Software Engineer' if not specified.
      Identify gaps for that role.
    `;

    // 3. AI Analysis
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lifemaxxing.app", 
        "X-Title": "LifeMaxxing"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": `Analyze this resume:\n\n${text}`
          }
        ],
        "temperature": 0.2
      })
    });

    if (!aiResponse.ok) {
        throw new Error(`AI API Error: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    const rawContent = data.choices?.[0]?.message?.content;
    
    // Sanitize JSON
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("CareerMaxxer Parse Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
