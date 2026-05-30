const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'albin@nordvaxt.se';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nordväxt AB <kontakt@nordvaxt.se>';

function clean(value) {
  return String(value || '').trim();
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(data) {
  const rows = [
    ['Förnamn', data.fname],
    ['Efternamn', data.lname],
    ['E-post', data.email],
    ['Telefon', data.phone || '-'],
    ['Företag', data.company || '-'],
    ['Tjänst', data.service],
    ['Meddelande', data.message],
  ];

  return `<h2>Ny kontaktförfrågan från Nordväxt.se</h2>
  <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
    ${rows.map(([label, value]) => `<tr>
      <td style="border:1px solid #ddd;font-weight:bold;background:#f7f3ea">${escapeHtml(label)}</td>
      <td style="border:1px solid #ddd">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
    </tr>`).join('')}
  </table>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const required = ['fname', 'lname', 'email', 'service', 'message'];
  const missing = required.filter((field) => !clean(data[field]));

  if (missing.length) {
    return res.status(400).json({ ok: false, error: 'Missing required fields', missing });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({
      ok: false,
      error: 'Email service is not configured',
      fallback: 'mailto',
    });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: clean(data.email),
      subject: 'Ny kontaktförfrågan från Nordväxt.se',
      html: buildEmailHtml(data),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(502).json({ ok: false, error: 'Email provider failed', details: errorText });
  }

  return res.status(200).json({ ok: true });
}
