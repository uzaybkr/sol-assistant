// Server-only helpers shared by the API routes.

// Read a secret at runtime (production) or from .env via Vite (dev).
export const env = key => process.env[key] ?? import.meta.env[key];

// Known limit: in-memory sliding window per IP. Resets on restart and is per-instance;
// move to Redis/Upstash if the site runs on several instances or serverless.
const hits = new Map();
export function limited(key, max, windowMs) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > windowMs) hits.delete(k);
  return recent.length > max;
}

export function clientIp(ctx) {
  const fwd = ctx.request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  try { return ctx.clientAddress; } catch { return 'unknown'; }
}

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

// Validate a chat transcript from the browser. Returns an error string or null.
export function checkMessages(messages, { maxTurns = 20, maxChars = 1000 } = {}) {
  if (!Array.isArray(messages) || messages.length === 0) return 'messages must be a non-empty array';
  if (messages.length > maxTurns) return 'conversation too long';
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (!m || typeof m.content !== 'string' || !m.content.trim()) return `message ${i} is empty`;
    if (m.role !== (i % 2 === 0 ? 'user' : 'assistant')) return 'roles must alternate starting with user';
    if (m.role === 'user' && m.content.length > maxChars) return `message ${i} is too long`;
    if (m.content.length > 6000) return `message ${i} is too long`;
  }
  if (messages[messages.length - 1].role !== 'user') return 'last message must be from the user';
  return null;
}
