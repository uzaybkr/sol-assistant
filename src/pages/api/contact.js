// POST /api/contact: validates the contact form and delivers it by email through Resend.
// Without RESEND_API_KEY it answers 503 so the page tells visitors to email directly.
import { EMAIL, TOPICS } from '../../data/site.js';
import { env, limited, clientIp, json } from '../../lib/server.js';

export const prerender = false;

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(ctx) {
  if (limited('contact:' + clientIp(ctx), 5, 10 * 60_000)) return json({ error: 'Too many messages. Please wait a few minutes.' }, 429);

  let d;
  try { d = await ctx.request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (clean(d.website, 200)) return json({ ok: true }); // honeypot: bots fill the hidden field

  const f = {
    name: clean(d.name, 100), email: clean(d.email, 200), company: clean(d.company, 150),
    phone: clean(d.phone, 40), topic: TOPICS.includes(d.topic) ? d.topic : TOPICS[0], message: clean(d.message, 5000),
  };
  if (!f.name) return json({ error: 'Please enter your name.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (f.message.length < 10) return json({ error: 'Please add a few more details to your message.' }, 400);

  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return json({ error: `The form isn't connected yet. Please email ${EMAIL} directly.` }, 503);

  const urgent = f.topic.startsWith('Urgent');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env('CONTACT_FROM') || 'Acme Cyber Website <onboarding@resend.dev>',
      to: [env('CONTACT_TO') || EMAIL],
      reply_to: f.email,
      subject: `${urgent ? 'URGENT: ' : ''}${f.topic} from ${f.name}${f.company ? ` (${f.company})` : ''}`,
      text: `Name: ${f.name}\nEmail: ${f.email}\nCompany: ${f.company || '-'}\nPhone: ${f.phone || '-'}\nTopic: ${f.topic}\n\n${f.message}`,
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error('[contact] delivery failed:', res?.status, await res?.text().catch(() => ''));
    return json({ error: `We couldn't send your message. Please email ${EMAIL} directly.` }, 502);
  }
  return json({ ok: true });
}
