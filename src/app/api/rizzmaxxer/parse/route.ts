import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL required' }, { status: 400 });
    }

    const systemPrompt = `
      You are a social dynamics expert aka 'Rizz Coach'. Analyze the screenshot of this chat.
      Identify the other person's name (if visible, else 'Unknown').
      Determine the 'Status' of the relationship: 'Talking Stage', 'Friendzone', 'Crush', 'Roster', 'Cold'.
      Calculate a 'Score' (0-100) based on their interest level.
      Provide a brief 'Note' on the dynamic.
      
      Output JSON:
      {
        "name": "Name",
        "status": "Talking Stage",
        "score": 85,
        "notes": "High engagement, fast replies.",
        "last_msg_time": "2023-10-27T10:00:00.000Z" (Estimate relative to now if visible, else use current time)
      }
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            "content": [
                { "type": "text", "text": "Analyze this chat log." },
                { "type": "image_url", "image_url": { "url": fileUrl } }
            ]
          }
        ],
        "temperature": 0.2
      })
    });

    if (!response.ok) {
        throw new Error(`AI Service Error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    
    // Sanitize JSON
    let jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    const result = JSON.parse(jsonString);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("RizzMaxxer Parse Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
