export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { messages, system, max_tokens } = req.body;

    const openaiMessages = [];
    if (system) openaiMessages.push({ role: 'system', content: system });

    for (const m of messages) {
      if (typeof m.content === 'string') {
        openaiMessages.push({ role: m.role, content: m.content });
      } else if (Array.isArray(m.content)) {
        const textParts = m.content
          .filter(c => c.type === 'text')
          .map(c => c.text)
          .join('\n');
        const docParts = m.content.filter(c => c.type === 'document');
        if (docParts.length > 0) {
          openaiMessages.push({
            role: m.role,
            content: [
              ...docParts.map(c => ({
                type: 'file',
                file: {
                  filename: 'edital.pdf',
                  file_data: `data:${c.source.media_type};base64,${c.source.data}`
                }
              })),
              { type: 'text', text: textParts }
            ]
          });
        } else {
          openaiMessages.push({ role: m.role, content: textParts });
        }
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
        max_tokens: max_tokens || 1000,
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
