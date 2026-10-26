// npm run check: fast self-checks for the logic that's easy to break, plus a pre-launch content warning.
import assert from 'node:assert/strict';
import { match } from '../src/scripts/intents.js';
import { coverage, packagesFor, resolveNeeds } from '../src/scripts/plan.js';
import { checkMessages } from '../src/lib/server.js';
import { scoreReadiness } from '../src/scripts/readiness.js';
import { NEEDS, TESTIMONIALS, CASES, HISTORY, READINESS, PRICING, BOOKING_URL, TOPICS, TOPIC_FROM_PARAM, monthlyFor } from '../src/data/site.js';

// Chat routing: specific intents must beat generic keyword matches.
const routes = {
  'My business was hacked': 'emergency',
  'we got hit by ransomware on a laptop': 'emergency',
  'Just email and files': 'email-files',
  'All of it': 'all',
  'how much does it cost?': 'pricing',
  'What is Web Fortress?': 'fortress',
  'And Security Operations?': 'secops',
  'What does monitoring cover?': 'monitoring',
  'How do backups help?': 'backup',
  'What is a pentest?': 'pentest',
  'Talk to a human': 'human',
  'Start onboarding': 'start',
  'hello': 'hello',
  'what is the weather in Paris': 'fallback',
  'our cyber insurance renewal is next month': 'readiness',
  'do you work with dental practices?': 'industry',
  'we are a CPA firm': 'industry',
};
for (const [text, id] of Object.entries(routes)) assert.equal(match(text).id, id, `"${text}" should route to ${id}`);

// Plan builder math.
assert.equal(NEEDS.reduce((s, n) => s + n.w, 0), 100, 'need weights must sum to 100');
assert.equal(coverage(NEEDS.map(n => n.id)), 100);
assert.equal(coverage([]), 0);
assert.deepEqual(packagesFor(['email', 'pentest']), ['fortress', 'pentest']);
assert.deepEqual(resolveNeeds('?needs=pentest,bogus'), ['pentest']);
assert.equal(resolveNeeds('?preset=secops').length, 3);
assert.deepEqual(resolveNeeds(''), ['email', 'drive', 'soc', 'backup']);

// Readiness scoring: all yes = ready, one critical gap never counts as ready, unsure = gap.
const all = v => Object.fromEntries(READINESS.map(q => [q.id, v]));
assert.deepEqual([scoreReadiness(all('yes')).score, scoreReadiness(all('yes')).band], [100, 'ready']);
assert.deepEqual([scoreReadiness(all('no')).score, scoreReadiness(all('no')).band], [0, 'risk']);
assert.equal(scoreReadiness({ ...all('yes'), mfa_email: 'no' }).band, 'gaps');
assert.equal(scoreReadiness({ ...all('yes'), mfa_email: 'unsure' }).gaps[0].id, 'mfa_email');
assert.equal(scoreReadiness({ ...all('yes'), mfa_email: 'no', edr: 'no' }).band, 'risk');
const mixed = scoreReadiness({ ...all('yes'), passwords: 'no', mfa_email: 'no' });
assert.equal(mixed.gaps[0].level, 'critical', 'gaps sorted most important first');

// Pricing: minimum applies to small teams; every contact-link topic is a real topic.
assert.equal(monthlyFor(PRICING.plans[0], 5), PRICING.plans[0].min);
assert.equal(monthlyFor(PRICING.plans[0], 100), PRICING.plans[0].perUser * 100);
for (const t of Object.values(TOPIC_FROM_PARAM)) assert.ok(TOPICS.includes(t), t + ' missing from TOPICS');

// Chat API input validation.
assert.equal(checkMessages([{ role: 'user', content: 'hi' }]), null);
assert.ok(checkMessages([]));
assert.ok(checkMessages([{ role: 'assistant', content: 'hi' }]));
assert.ok(checkMessages([{ role: 'user', content: 'a' }, { role: 'user', content: 'b' }]));
assert.ok(checkMessages([{ role: 'user', content: 'x'.repeat(1001) }]));
assert.ok(checkMessages(Array.from({ length: 21 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x' }))));

console.log('✓ all checks passed');

const samples = [...TESTIMONIALS, ...CASES, ...HISTORY].filter(x => x.sample).length;
if (!PRICING.confirmed) console.warn('⚠ Pricing is still marked as draft (PRICING.confirmed = false in src/data/site.js).');
if (!BOOKING_URL) console.warn('⚠ No booking link yet: "Book a call" buttons open the contact form (set BOOKING_URL in src/data/site.js).');
if (samples) console.warn(`⚠ ${samples} example entries in src/data/site.js still need real content before launch (sample: true).`);
