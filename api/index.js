export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const hasKey = !!process.env.GEMINI_API_KEY;
    const keyStart = process.env.GEMINI_API_KEY?.slice(0, 10) || 'NOT FOUND';
    return res.status(200).json({ hasKey, keyStart });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { model, messages, system, max_tokens } = req.body;

    const contents = messages.map(m => {
      if (typeof m.content === 'string') {
        return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
      }
      const parts = m.content.map(c => {
        if (c.type === 'text') return { text: c.text };
        if (c.type === 'document') return {
          inlineData: { mimeType: c.source.media_type, data: c.source.data }
        };
        return { text: JSON.stringify(c) };
      });
      return { role: m.role === 'assistant' ? 'model' : 'user', parts };
    });

    const systemInstruction = system ? { parts: [{ text: system }] } : undefined;
    const geminiModel = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    const body = {
      contents,
      ...(systemInstruction && { systemInstruction }),
      generationConfig: { maxOutputTokens: max_tokens || 4000 }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    // Log completo para debug
    console.log('Gemini response:', JSON.stringify(data).slice(0, 500));

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      return res.status(500).json({ error: 'Empty response', raw: JSON.stringify(data).slice(0, 200) });
    }

    res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
