import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL required' }, { status: 400 });
    }

    const systemPrompt = `
      You are a financial AI agent. Analyze the provided receipt image.
      Extract the following data into a strict JSON object:
      {
        "description": "Merchant Name - Item Summary",
        "amount": -10.50, (Negative for expense, Positive for income/refund)
        "date": "YYYY-MM-DD",
        "category": "One of: Food, Transport, Utilities, Entertainment, Shopping, Health, Other",
        "type": "expense"
      }
      If the date is missing, use today's date.
      Ensure the output is pure JSON without Markdown code blocks.
    `;

    // Using a Vision-capable model (Gemini Flash or similar)
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
              { "type": "text", "text": "Analyze this receipt." },
              { "type": "image_url", "image_url": { "url": fileUrl } }
            ]
          }
        ],
        "temperature": 0.1
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("OpenRouter Error:", err);
        throw new Error(`AI Service Error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    
    if (!rawContent) {
        throw new Error("No content received from AI");
    }

    // Sanitize JSON
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
        parsedData = JSON.parse(jsonString);
    } catch (e) {
        console.error("JSON Parse Error:", rawContent);
        throw new Error("Failed to parse AI response");
    }

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Receipt Parse Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
