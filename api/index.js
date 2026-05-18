export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'questoes@dominabanca.com.br';

  if (!RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY não configurada' });
  if (!ADMIN_EMAIL) return res.status(500).json({ error: 'ADMIN_EMAIL não configurado' });

  try {
    const { tipo, questaoNum, tipoLabel, alunoEmail, observacao } = req.body;

    if (tipo === 'report') {
      const nQ = questaoNum || 'S/N';

      // Email para o admin
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `DominaBanca <${FROM_EMAIL}>`,
          to: [ADMIN_EMAIL],
          subject: `[Report] ${nQ} — ${tipoLabel}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#6C3CE1">📋 Report — DominaBanca</h2>
              <p><b>Questão:</b> ${nQ}</p>
              <p><b>Tipo:</b> ${tipoLabel}</p>
              <p><b>Aluno:</b> ${alunoEmail}</p>
              <p><b>Observação:</b> ${observacao}</p>
              <hr/>
              <p style="color:#999;font-size:12px">DominaBanca — Estudos para concursos públicos</p>
            </div>
          `
        })
      });

      // Email de confirmação para o aluno
      if (alunoEmail) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `DominaBanca <${FROM_EMAIL}>`,
            to: [alunoEmail],
            subject: `✅ Report recebido — ${nQ}`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#6C3CE1">✅ Report recebido!</h2>
                <p>Recebemos seu report sobre a questão <b>${nQ}</b>.</p>
                <p><b>Tipo:</b> ${tipoLabel}</p>
                <p><b>Observação:</b> ${observacao}</p>
                <p>Analisaremos e retornaremos em breve. Obrigado por contribuir! 🙏</p>
                <hr/>
                <p style="color:#999;font-size:12px">DominaBanca — Estudos para concursos públicos</p>
              </div>
            `
          })
        });
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Tipo de email inválido' });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ error: error.message });
  }
}
