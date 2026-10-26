// Offline answers for Sol. Used when the AI endpoint is unavailable, and for quick-reply actions.
// Order matters: the first matching intent wins, so specific phrases go before generic ones.
// Actions: {plan: [...needIds]} opens the plan builder, {href} navigates, {copy: text} copies.

export const EMAIL = 'support@example.com';
export const START = ['What is Web Fortress?', 'My business was hacked', 'Pricing', 'Talk to a human'];

export const INTENTS = [
  { id: 'emergency', k: /breach|hack(ed)?\b|attack(ed)?|ransom(ware)? (hit|on|attack)|emergency|urgent|compromis/i,
    a: `If something is happening right now, email ${EMAIL} with URGENT in the subject line and a phone number. Disconnect the affected machine from the network (don't power it off) and don't pay any ransom. An analyst will pick it up.`,
    act: { label: 'Copy our email address', copy: EMAIL }, q: ['How do backups help?', 'What does monitoring cover?'] },
  { id: 'all', k: /all of it|everything/i,
    a: 'Then you want Web Fortress plus Security Operations. I can load that into the plan builder.',
    act: { label: 'Build the full plan', plan: 'all' } },
  { id: 'email-files', k: /just email|email and files/i,
    a: "Web Fortress's portal covers that: business email and an encrypted drive, with 24/7 monitoring and backups behind it.",
    act: { label: 'Load that plan', plan: ['email', 'drive', 'soc', 'backup'] } },
  { id: 'readiness', k: /insur|readiness|questionnaire|renewal/i,
    a: 'Cyber insurers now ask detailed security questions before they quote. Our free readiness check covers 15 of the most common ones in about three minutes and shows exactly which gaps to fix first.',
    act: { label: 'Take the readiness check', href: '/readiness' }, q: ['Pricing', 'Talk to a human'] },
  { id: 'pricing', k: /price|pricing|cost|how much|quote|budget|\$/i,
    a: 'Starting prices are on our pricing page, with an estimate for your team size. Your exact price depends on team size and the layers you need, and the plan builder sends that to us for a quote.',
    act: { label: 'See pricing', href: '/pricing' }, q: ['What is Web Fortress?', 'Talk to a human'] },
  { id: 'industry', k: /dental|dentist|medical|clinic|practice|hipaa|patient|cpa|accountant|accounting|tax|bookkeep|safeguards/i,
    a: 'We specialize in healthcare practices and accounting and tax firms, where HIPAA and the FTC Safeguards Rule set the bar. Each has a page explaining what the rule asks for and how we cover it.',
    act: { label: 'See industry pages', href: '/industries/healthcare' }, q: ['Pricing', 'Talk to a human'] },
  { id: 'fortress', k: /fortress|portal|\bemail\b|drive|website|ssl|workplace/i,
    a: 'Web Fortress is your secure workplace: an employee portal with email and an encrypted drive, your website with a Google Trust SSL certificate, 24/7 monitoring by US-based SOC analysts, and ransomware protection through verifiable backups.',
    act: { label: 'See Web Fortress', href: '/solutions/web-fortress' }, q: ['And Security Operations?', 'Pricing'] },
  { id: 'secops', k: /sec(urity)? ?op|siem|\blogs?\b|audit|report/i,
    a: 'Security Operations is the oversight layer: SIEM and log auditing, security reports with ranked recommendations, and cybersecurity awareness training for your staff.',
    act: { label: 'See Security Operations', href: '/solutions/security-operations' }, q: ['What is a pentest?', 'Pricing'] },
  { id: 'monitoring', k: /\bsoc\b|monitor|24\/?7|analyst|watch/i,
    a: 'Our SOC is staffed by US-based analysts around the clock. Logs from your portal, website and devices stream into our SIEM, and an analyst triages anything suspicious, contains it and sends you a plain-language report.',
    act: { label: 'Watch the live view', href: '/monitoring' }, q: ['Ransomware protection', 'Pricing'] },
  { id: 'backup', k: /ransom|backup|restore|recover/i,
    a: 'We take backups on a schedule and verify them, so you know a restore will work. If ransomware hits, we isolate the machine and restore it from a clean copy instead of paying.',
    q: ['What does monitoring cover?', 'Pricing'] },
  { id: 'pentest', k: /pen ?test|penetration|vulnerab|scan/i,
    a: 'In a penetration test we attack your systems the way a criminal would, with your written permission, then give you a ranked list of what to fix first. It is a strong first step before monitoring.',
    act: { label: 'Add a pentest to my plan', plan: ['pentest'] }, q: ['Training', 'Pricing'] },
  { id: 'training', k: /train|phish|awareness|staff/i,
    a: 'Awareness training is short and practical: spotting phishing, handling passwords and reporting quickly. Most breaches start with one click, so this layer pays for itself.',
    q: ['What is Security Operations?', 'Talk to a human'] },
  { id: 'start', k: /start|onboard|sign ?up|get started|begin|set ?up/i,
    a: 'Getting started takes four steps: Assess your current setup, Harden the biggest gaps, Monitor 24/7, then Improve with regular reports and retests.',
    act: { label: 'Build my plan', plan: [] }, q: ['Pricing', 'Talk to a human'] },
  { id: 'human', k: /human|contact|talk|call|sales|person|reach/i,
    a: `You can reach a real person at ${EMAIL}, or send a message from the contact page and we will reply within one business day.`,
    act: { label: 'Go to the contact page', href: '/contact' }, q: ['Pricing', 'Start onboarding'] },
  { id: 'about', k: /who|about|company|acme|where/i,
    a: 'Acme Cyber protects small and mid-sized businesses with a secure workplace platform and a US-based security operations team. Your business, protected and watched 24/7.',
    act: { label: 'About the company', href: '/company' }, q: ['What is Web Fortress?', 'What does monitoring cover?'] },
  { id: 'hello', k: /^(hi|hey|hello|yo|good (morning|afternoon|evening))\b/i,
    a: 'Hello. What are you looking to protect: your email, your files, your website, or all of it?', q: ['All of it', 'Just email and files', 'Pricing'] },
  { id: 'thanks', k: /thank|thx|cheers/i, a: "You're welcome. I'm here if anything else comes up." },
];

export const FALLBACK = {
  id: 'fallback',
  a: `I can help with our services, pricing, monitoring, ransomware protection, pentests and training. For anything else, ${EMAIL} reaches a real person.`,
  q: START,
};

export const match = text => INTENTS.find(i => i.k.test(text)) || FALLBACK;
