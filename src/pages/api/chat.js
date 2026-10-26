// POST /api/chat: streams Sol's answer from Claude as plain text.
// 503 means "AI not configured/unreachable"; the browser then uses its offline answers.
import Anthropic from '@anthropic-ai/sdk';
import { EMAIL, SOLUTIONS, SERVICES, PROCESS, FAQ } from '../../data/site.js';
import { env, limited, clientIp, json, checkMessages } from '../../lib/server.js';

export const prerender = false;

const SYSTEM = `You are Sol, the website assistant for Acme Cyber, a cybersecurity company that protects small and mid-sized businesses. Tagline: "Your business, protected. Watched 24/7."

What Acme Cyber offers (this is the complete list; do not add products, prices, certifications, client names, statistics or guarantees that are not written here):
${SOLUTIONS.map(s => `- ${s.name}: ${s.summary} Includes: ${s.features.map(f => f[0]).join('; ')}.`).join('\n')}
Services:
${SERVICES.map(s => `- ${s.name}: ${s.long}`).join('\n')}
How onboarding works: ${PROCESS.map(([t, d]) => `${t} (${d})`).join(' ')}
FAQ:
${FAQ.map(([q, a]) => `Q: ${q} A: ${a}`).join('\n')}

Contact: ${EMAIL}. Website pages: /solutions, /services, /monitoring, /pricing (starting prices and a team-size estimate), /plan (build a protection plan and send it), /readiness (free 15-question cyber-insurance readiness check), /industries/healthcare, /industries/accounting, /resources (guides), /results, /company, /contact.
To reach a person, visitors can use the "Book a call" or "Send this chat to the team" buttons under this chat, or /contact.

How to answer:
- Be warm, direct and brief: two to five sentences. Plain text only, no markdown, no bullet symbols, no headings.
- Starting prices are published on /pricing. Point people there instead of quoting or estimating numbers yourself; exact quotes come from the team.
- If someone asks about cyber insurance or an upcoming renewal, suggest the free readiness check at /readiness.
- When someone is ready to buy or wants specifics about their own setup, suggest booking a call.
- If someone may be under attack right now, tell them to email ${EMAIL} with URGENT in the subject and a phone number, disconnect the affected device from the network without powering it off, and not pay any ransom.
- General security questions are welcome; give practical, defensive advice a business owner can act on. Decline to help with attacking systems, malware, bypassing security or accessing accounts that aren't theirs, and offer defensive help instead.
- If you don't know something about Acme Cyber (staff, location, history, specific clients), say so and point to ${EMAIL}. Never invent facts about the company.
- Stay on topic. For unrelated requests, politely steer back to security and Acme Cyber.
- You cannot see the visitor's systems, take actions, or book meetings. Don't claim to.`;

let client;

export async function POST(ctx) {
  const key = env('ANTHROPIC_API_KEY');
  if (!key) return json({ error: 'ai_unavailable' }, 503);
  if (limited('chat:' + clientIp(ctx), 20, 10 * 60_000)) return json({ error: 'rate_limited' }, 429);

  let body;
  try { body = await ctx.request.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const problem = checkMessages(body?.messages);
  if (problem) return json({ error: problem }, 400);
  const messages = body.messages.map(({ role, content }) => ({ role, content }));

  client ??= new Anthropic({ apiKey: key });
  const stream = client.beta.messages.stream({
    model: 'claude-opus-5',
    max_tokens: 1024, // chat replies are short by design; also caps cost per message
    output_config: { effort: 'low' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM,
    messages,
  });

  // Wait for the first event so auth/network failures become a 503 the client can fall back from.
  const events = stream[Symbol.asyncIterator]();
  let first;
  try {
    first = await events.next();
  } catch (err) {
    console.error('[chat] upstream error:', err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
    return json({ error: 'ai_unavailable' }, 503);
  }

  const enc = new TextEncoder();
  const body$ = new ReadableStream({
    async start(controller) {
      const emit = ev => {
        if (ev?.type === 'content_block_delta' && ev.delta.type === 'text_delta') controller.enqueue(enc.encode(ev.delta.text));
      };
      try {
        if (!first.done) emit(first.value);
        for (let r = await events.next(); !r.done; r = await events.next()) emit(r.value);
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') {
          controller.enqueue(enc.encode(`\n\nI can't help with that one here. For anything security-related, our team can talk it through at ${EMAIL}.`));
        } else if (final.stop_reason === 'max_tokens') {
          controller.enqueue(enc.encode(`…\n\nThat's the short version. Our team can go deeper at ${EMAIL}.`));
        }
      } catch (err) {
        console.error('[chat] stream error:', err);
        controller.enqueue(enc.encode(`\n\nSorry, I lost the connection. Please try again or email ${EMAIL}.`));
      }
      controller.close();
    },
    cancel() { stream.abort(); },
  });

  return new Response(body$, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
  });
}
