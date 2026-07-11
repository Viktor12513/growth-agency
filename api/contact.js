const TO_EMAIL = 'albin@plasmamedia.se';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Plasma MEDIA AB <kontakt@plasmamedia.se>';
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = globalThis.__contactRateLimitStore || new Map();
globalThis.__contactRateLimitStore = rateLimitStore;

function clean(value) {
  return String(value || '').trim();
}

function limit(value, maxLength) {
  return clean(value).slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(clean(value));
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown';
}

function getAllowedOrigins(req) {
  const host = req.headers.host ? `https://${req.headers.host}` : '';
  const configured = [
    process.env.SITE_ORIGIN,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    'https://www.plasmamedia.se',
    'https://plasmamedia.se',
    'http://127.0.0.1:4173',
    'http://localhost:4173',
  ];

  return new Set([host, ...configured].filter(Boolean));
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  return getAllowedOrigins(req).has(origin);
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = rateLimitStore.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (current.resetAt <= now) {
    current.count = 0;
    current.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  current.count += 1;
  rateLimitStore.set(ip, current);

  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) rateLimitStore.delete(key);
  }

  return current.count > RATE_LIMIT_MAX_REQUESTS;
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
    ['Quizrekommendation', data.quizRecommendation || '-'],
    ['Quizsvar', data.quizResult || '-'],
    ['Meddelande', data.message],
  ];

  return `<h2>Ny kontaktförfrågan från Plasma MEDIA AB</h2>
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

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ ok: false, error: 'Forbidden origin' });
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false, error: 'Request too large' });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  let rawData;
  try {
    rawData = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid request body' });
  }

  if (clean(rawData.website)) {
    return res.status(200).json({ ok: true });
  }

  const data = {
    fname: limit(rawData.fname, 80),
    lname: limit(rawData.lname, 80),
    email: limit(rawData.email, 160),
    phone: limit(rawData.phone, 60),
    company: limit(rawData.company, 140),
    service: limit(rawData.service, 60),
    quizResult: limit(rawData.quizResult, 1200),
    quizRecommendation: limit(rawData.quizRecommendation, 700),
    message: limit(rawData.message, 3000),
  };

  const required = ['fname', 'lname', 'email', 'service', 'message'];
  const missing = required.filter((field) => !clean(data[field]));

  if (missing.length) {
    return res.status(400).json({ ok: false, error: 'Missing required fields', missing });
  }

  if (!isValidEmail(data.email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' });
  }

  if (data.message.length < 10) {
    return res.status(400).json({ ok: false, error: 'Message is too short' });
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
      subject: 'Ny kontaktförfrågan från Plasma MEDIA AB',
      html: buildEmailHtml(data),
    }),
  });

  if (!response.ok) {
    return res.status(502).json({ ok: false, error: 'Email provider failed' });
  }

  return res.status(200).json({ ok: true });
}
