export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ hasKey: !!process.env.OPENAI_API_KEY });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No key' });

  try {
    const { messages, system, max_tokens } = req.body;

    // Converter formato Anthropic para OpenAI
    const openaiMessages = [];
    if (system) openaiMessages.push({ role: 'system', content: system });

    for (const m of messages) {
      if (typeof m.content === 'string') {
        openaiMessages.push({ role: m.role, content: m.content });
      } else {
        // Suporte a PDF e imagens
        const parts = m.content.map(c => {
          if (c.type === 'text') return { type: 'text', text: c.text };
          if (c.type === 'document') return {
            type: 'file',
            file: { filename: 'edital.pdf', file_data: `data:${c.source.media_type};base64,${c.source.data}` }
          };
          return { type: 'text', text: JSON.stringify(c) };
        });
        openaiMessages.push({ role: m.role, content: parts });
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: max_tokens || 4000,
        messages: openaiMessages
      })
    });

    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
