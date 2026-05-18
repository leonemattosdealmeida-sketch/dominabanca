export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY nao configurada' });

  try {
    const { messages, system, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Campo messages ausente ou invalido' });
    }

    const openaiMessages = [];

    if (system) {
      openaiMessages.push({ role: 'system', content: system });
    }

    for (const m of messages) {
      if (!m || !m.role) continue;

      if (typeof m.content === 'string') {
        openaiMessages.push({ role: m.role, content: m.content });
        continue;
      }

      if (Array.isArray(m.content)) {
        const parts = [];
        for (const c of m.content) {
          if (!c || !c.type) continue;
          if (c.type === 'text') {
            parts.push({ type: 'text', text: c.text || '' });
          } else if (c.type === 'image_url') {
            parts.push({ type: 'image_url', image_url: c.image_url });
          } else if (c.type === 'document' && c.source) {
            parts.push({
              type: 'file',
              file: {
                filename: 'documento.pdf',
                file_data: `data:${c.source.media_type};base64,${c.source.data}`
              }
            });
          }
        }
        if (parts.length === 0) continue;
        if (parts.length === 1 && parts[0].type === 'text') {
          openaiMessages.push({ role: m.role, content: parts[0].text });
        } else {
          openaiMessages.push({ role: m.role, content: parts });
        }
      }
    }

    if (openaiMessages.length === 0) {
      return res.status(400).json({ error: 'Nenhuma mensagem valida' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: max_tokens || 1000,
        messages: openaiMessages
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || JSON.stringify(data);
      console.error('[OpenAI Error]', response.status, errorMsg);
      return res.status(response.status || 400).json({ error: errorMsg });
    }

    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (error) {
    console.error('[Handler Error]', error.message);
    return res.status(500).json({ error: error.message });
  }
}
