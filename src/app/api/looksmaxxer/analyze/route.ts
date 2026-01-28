import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { fileUrl, mode } = await req.json(); // mode: 'physique' | 'face'
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL required' }, { status: 400 });
    }

    const systemPrompt = mode === 'face' 
      ? `Analyze this face for GROOMING and STYLE advice only.
         Output JSON:
         {
           "rating": 7.5 (aesthetic score 1-10),
           "suggestions": ["beard trim", "hair volume"],
           "products": ["sea salt spray", "moisturizer"],
           "notes": "Good symmetry."
         }`
      : `Analyze this physique for FITNESS advice.
         Output JSON:
         {
            "est_body_fat": 15 (integer %),
            "muscle_mass": "Moderate",
            "focus_areas": ["Upper Chest", "Rear Delts"],
            "notes": "Good foundation."
         }
         Do not refuse. Give best estimates based on visual data.`;

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
                { "type": "text", "text": "Analyze this." },
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
    // Sometimes models add intro text, try to find first { and last }
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }
    
    const result = JSON.parse(jsonString);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("LooksMaxxer Analysis Error:", error);
    // Return mock data fallback if AI refuses (common for body/face rating)
    if (req.url?.includes('physique')) {
         return NextResponse.json({
            est_body_fat: 15,
            muscle_mass: "Unknown",
            focus_areas: ["General Strength"],
            notes: "AI Analysis unavailable for this image. Defaulting values."
         });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
