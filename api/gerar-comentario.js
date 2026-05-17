export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { prompt, media } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt é obrigatório' });

  try {
    let content;

    if (media) {
      // Imagem ou PDF enviado junto com o prompt
      if (media.source?.media_type === 'application/pdf') {
        content = [
          {
            type: 'file',
            file: {
              filename: 'documento.pdf',
              file_data: `data:application/pdf;base64,${media.source.data}`
            }
          },
          { type: 'text', text: prompt }
        ];
      } else {
        // Imagem
        content = [
          {
            type: 'image_url',
            image_url: {
              url: `data:${media.source.media_type};base64,${media.source.data}`
            }
          },
          { type: 'text', text: prompt }
        ];
      }
    } else {
      content = prompt;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [{ role: 'user', content }]
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
