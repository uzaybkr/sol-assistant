// Single source of truth for site content. Edit here, every page updates.

export const EMAIL = 'support@example.com';

// Paste your Cal.com / Calendly link here (e.g. 'https://cal.com/acme/15min').
// While empty, every "Book a call" button goes to the contact form instead.
export const BOOKING_URL = '';
export const bookHref = BOOKING_URL || '/contact?topic=call#form';

// Contact form topics (the API accepts only these).
export const TOPICS = ['General question', 'Book a call', 'Protection plan', 'Readiness check results', 'Web Fortress', 'Security Operations', 'Penetration test', 'Training', 'Urgent: possible incident'];
export const TOPIC_FROM_PARAM = { plan: 'Protection plan', call: 'Book a call', readiness: 'Readiness check results', chat: 'General question' };

export const NAV = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/services', label: 'Services' },
  { href: '/industries/healthcare', label: 'Industries', match: '/industries' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/resources', label: 'Resources' },
  { href: '/company', label: 'Company' },
  { href: '/contact', label: 'Contact' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRICING. `confirmed: false` shows a "Draft pricing" label on the site and
// `npm run check` warns. Confirm the numbers, then set confirmed: true.
// ─────────────────────────────────────────────────────────────────────────────
export const PRICING = {
  confirmed: false,
  onboarding: 'One-time onboarding from $1,500, depending on team size and migration.',
  plans: [
    { id: 'fortress', name: 'Web Fortress', perUser: 45, min: 900, blurb: 'The secure workplace, watched 24/7.',
      features: ['Employee portal with email', 'Encrypted drive', 'Website with Google Trust SSL', '24/7 US-based SOC monitoring', 'Verified ransomware backups'] },
    { id: 'complete', name: 'Fortress Complete', perUser: 75, min: 2000, featured: true, blurb: 'Everything in Web Fortress, plus the oversight layer.',
      features: ['Everything in Web Fortress', 'SIEM and log auditing', 'Monthly security reports', 'Awareness training for all staff', 'Priority incident response'] },
  ],
  oneTime: [
    { name: 'Security Snapshot', price: '$495', note: 'One-week external exposure review with a 30-minute readout. Credited to your first month if you sign up.' },
    { name: 'Penetration test', price: 'from $4,500', note: 'External network test from $4,500; web application test from $9,500.' },
  ],
  // Business terms shown on the pricing page. Confirm these along with the prices.
  faq: [
    ['Who counts as a user?', 'Anyone with a login to the employee portal or a monitored device. Shared front-desk computers count once.'],
    ['Is there a long contract?', 'Plans run month to month after onboarding. Clients who commit to 36 months receive a discount.'],
    ["What if we're attacked?", 'Incident response on systems we protect is included in Fortress Complete. On Web Fortress, containment and restore from backup are included; deeper investigations are quoted separately.'],
    ['Can we start with just the Security Snapshot?', 'Yes. Many clients start there, and the $495 is credited to your first month if you sign up.'],
  ],
};
export const monthlyFor = (plan, users) => Math.max(plan.min, plan.perUser * users);

// Logos for the trust bar (certifications, partners, carriers). The bar stays
// hidden while this is empty. Only add ones you have permission to show.
// Format: { name: 'Partner name', src: '/logos/partner.svg' } with the file in public/logos/.
export const TRUST = [];

// Plan builder options. `w` = weight toward the coverage score (sums to 100).
export const NEEDS = [
  { id: 'email',   label: 'Business email',       w: 12, pkg: 'fortress' },
  { id: 'drive',   label: 'Encrypted file drive', w: 12, pkg: 'fortress' },
  { id: 'site',    label: 'Secure website + SSL', w: 10, pkg: 'fortress' },
  { id: 'soc',     label: '24/7 SOC monitoring',  w: 18, pkg: 'fortress' },
  { id: 'backup',  label: 'Ransomware backups',   w: 14, pkg: 'fortress' },
  { id: 'siem',    label: 'SIEM & log auditing',  w: 12, pkg: 'secops' },
  { id: 'reports', label: 'Security reports',     w: 6,  pkg: 'secops' },
  { id: 'train',   label: 'Staff training',       w: 8,  pkg: 'secops' },
  { id: 'pentest', label: 'Penetration test',     w: 8,  pkg: 'pentest' },
];

export const PACKAGES = {
  fortress: 'Web Fortress',
  secops: 'Security Operations',
  pentest: 'Penetration testing',
};

export const PRESETS = {
  fortress: NEEDS.filter(n => n.pkg === 'fortress').map(n => n.id),
  secops: NEEDS.filter(n => n.pkg === 'secops').map(n => n.id),
  all: NEEDS.map(n => n.id),
};

export const SOLUTIONS = [
  {
    slug: 'web-fortress',
    name: 'Web Fortress',
    tag: 'Workplace',
    summary: 'The secure place your team works: email, files and your website, watched around the clock.',
    features: [
      ['Employee portal with email', 'One sign-in for your team’s business email and tools, with multi-factor authentication switched on from day one.'],
      ['Encrypted drive', 'Company files stored encrypted, shared with the right people, and taken back instantly when someone leaves.'],
      ['Website with Google Trust SSL', 'Your site served over HTTPS with a certificate issued through Google Trust Services, renewed before it can lapse.'],
      ['24/7 US-based SOC monitoring', 'Analysts based in the United States watch sign-ins, file activity and your website day and night.'],
      ['Verifiable ransomware backups', 'Backups taken on a schedule and checked, so a restore is a known quantity instead of a hope.'],
    ],
  },
  {
    slug: 'security-operations',
    name: 'Security Operations',
    tag: 'Oversight',
    summary: 'The oversight layer: logs audited, risks reported in plain language, and a team trained to spot attacks.',
    features: [
      ['SIEM and log auditing', 'Logs from your systems collected in one place, correlated, and audited against a professional standard.'],
      ['Security reports', 'Regular reports that rank what matters, explain it without jargon, and say exactly what to do next.'],
      ['Recommendations you can act on', 'Every finding comes with an owner, a priority and a fix, so progress is visible to leadership.'],
      ['Cybersecurity awareness training', 'Short, practical sessions that teach your people to recognize phishing and report it quickly.'],
    ],
  },
];

export const SERVICES = [
  { id: 'monitoring', name: 'Monitoring', icon: 'pulse', tags: 'SOC · SIEM · Alerts',
    short: 'Around-the-clock watch over your portal, website and devices, run by analysts based in the US.',
    long: 'Our security operations center collects signals from your accounts, endpoints and website, and an analyst reviews anything unusual. Real threats are escalated to you with a clear explanation and a recommended action, at any hour.' },
  { id: 'security', name: 'Security', icon: 'shield', tags: 'Encryption · Backups · SSL',
    short: 'Hardened accounts, encrypted storage and backups you can actually restore from when ransomware hits.',
    long: 'We tighten sign-in policies, enforce multi-factor authentication, encrypt company data and keep verified backups. If ransomware lands on a machine, we isolate it and restore from a clean copy.' },
  { id: 'pentest', name: 'Pentest', icon: 'search', tags: 'External · Web app · Report',
    short: 'We attack your systems the way criminals would, then hand you a ranked list of what to fix first.',
    long: 'With your written permission, we test your external footprint and web applications for the weaknesses attackers look for. You receive a report that ranks each finding by risk, shows how it was exploited, and explains the fix.' },
  { id: 'training', name: 'Training', icon: 'cap', tags: 'Phishing · Passwords · Habits',
    short: 'Short, practical awareness sessions so your team recognizes phishing and reports it early.',
    long: 'Most breaches start with one click. Our training covers phishing, passwords, safe file sharing and how to report something suspicious, delivered in plain language that sticks.' },
];

export const PROCESS = [
  ['Assess', 'We review your accounts, devices, website and backups to find where you are exposed today.'],
  ['Harden', 'We fix the biggest gaps first, then move your team onto the Web Fortress portal.'],
  ['Monitor', 'Our SOC starts watching 24/7 and escalates anything that needs a human decision.'],
  ['Improve', 'Regular reports, retests and training keep your defenses moving as threats change.'],
];

// ─────────────────────────────────────────────────────────────────────────────
// PROOF CONTENT. Every entry marked `sample: true` is placeholder copy and is
// shown on the site with an "Example" label. Replace with real, approved client
// quotes, real cases and real dates, then set `sample: false`.
// `npm run check` lists anything still marked as a sample.
// ─────────────────────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { sample: true, quote: 'We used to find out about problems from our customers. Now Acme Cyber calls us first, with the fix already in motion.', name: 'Client name', role: 'Owner', org: 'Professional services firm' },
  { sample: true, quote: 'Moving the whole office onto the portal took a weekend. Nobody has asked me where a file lives since.', name: 'Client name', role: 'Office manager', org: 'Healthcare practice' },
  { sample: true, quote: 'The reports are the first security documents our board actually reads. Plain English, ranked, with a clear next step.', name: 'Client name', role: 'Operations director', org: 'Regional retailer' },
];

export const CASES = [
  { sample: true, sector: 'Healthcare practice', title: 'Ransomware stopped on a single workstation',
    problem: 'A staff laptop began encrypting files after a malicious attachment was opened.',
    action: 'Our analysts isolated the machine from the network, confirmed no other device was affected, and restored it from a verified backup.',
    result: 'The practice kept seeing patients. No ransom was paid and no patient data left the network.' },
  { sample: true, sector: 'Professional services', title: 'Credential-stuffing attack on the employee portal',
    problem: 'Hundreds of automated sign-in attempts targeted staff accounts using passwords leaked from other sites.',
    action: 'We blocked the source addresses, forced resets on the targeted accounts and confirmed multi-factor authentication held.',
    result: 'No account was taken over. The firm received a written summary the same morning.' },
  { sample: true, sector: 'Retail & e-commerce', title: 'Phishing campaign caught by a trained employee',
    problem: 'A convincing fake invoice email reached several inboxes during a busy sales week.',
    action: 'An employee who had completed our training reported it. We quarantined every copy and blocked the sender domain.',
    result: 'Nobody entered credentials. The incident became a case study in the next training session.' },
];

export const HISTORY = [
  { sample: true, year: '2019', title: 'Acme Cyber founded', text: 'Started with one belief: small and mid-sized businesses deserve the same protection as large enterprises.' },
  { sample: true, year: '2021', title: 'Web Fortress launched', text: 'A single secure workplace combining email, encrypted storage and a trusted website.' },
  { sample: true, year: '2023', title: 'US-based SOC goes 24/7', text: 'Round-the-clock monitoring staffed by analysts based in the United States.' },
  { sample: true, year: '2025', title: 'Security Operations and pentesting added', text: 'SIEM auditing, reporting, awareness training and penetration testing under one roof.' },
];

export const FAQ = [
  ['Who is Acme Cyber for?', 'Small and mid-sized businesses that need real security without building an in-house security team.'],
  ['Where are your analysts based?', 'Our security operations center is staffed by analysts based in the United States.'],
  ['Do I have to replace my current tools?', 'Not necessarily. We start with an assessment and recommend changes only where they reduce real risk.'],
  ['How is pricing set?', 'Starting prices are on the pricing page. Your exact price depends on team size and which layers you need; build a plan and we will reply with a proposal.'],
  ['What happens if we are attacked?', 'An analyst contains the threat, restores what is affected from verified backups, and sends you a plain-language report.'],
];

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRY PAGES (/industries/<slug>). Regulation summaries are plain-language
// overviews, not legal advice; the pages say so.
// ─────────────────────────────────────────────────────────────────────────────
export const INDUSTRIES = [
  {
    slug: 'healthcare',
    name: 'Healthcare practices',
    who: 'Dental, medical, physical therapy and specialty practices',
    title: 'Protect patient data.',
    accent: 'Pass your HIPAA review.',
    lede: 'Ransomware can close a practice for days. Acme Cyber keeps patient records encrypted, backed up and watched around the clock, and gives you the documentation your HIPAA risk analysis needs.',
    regulation: 'HIPAA Security Rule',
    regSummary: 'The HIPAA Security Rule requires practices that handle electronic patient information to assess their risks, put administrative, physical and technical safeguards in place, train staff, keep contingency plans including data backups, and sign business associate agreements with vendors who handle patient data.',
    pains: [
      ['Ransomware stops patient care', 'Locked scheduling and imaging systems mean cancelled appointments and lost revenue.'],
      ['The risk analysis never gets done', 'It is required, it is detailed, and it falls to an office manager who already has a full-time job.'],
      ['Staff click on convincing emails', 'Fake insurance and supplier emails are the most common way attackers get in.'],
    ],
    map: [
      ['Security risk analysis', 'Our assessment and Security Snapshot document where patient data lives and what threatens it.'],
      ['Access controls and unique logins', 'The employee portal gives every staff member their own login with multi-factor authentication.'],
      ['Audit controls', 'SIEM and log auditing record who accessed what, and our analysts review it.'],
      ['Transmission security and encryption', 'Encrypted email and drive storage protect records in transit and at rest.'],
      ['Contingency plan and data backup', 'Verified backups and a written restore procedure, tested on a schedule.'],
      ['Security awareness training', 'Short, practical training sessions for every staff member.'],
      ['Business associate agreement', 'Acme Cyber signs a BAA with every healthcare client.'],
    ],
    faq: [
      ['Will you sign a business associate agreement?', 'Yes. Every healthcare client receives a BAA before we handle any patient data.'],
      ['Can you work with our practice-management software?', 'Usually, yes. We protect the devices, accounts and network around it, and coordinate with the vendor where needed.'],
      ['We have an IT person. Do we still need you?', 'Many practices keep their IT support and add Acme Cyber for 24/7 monitoring, backups and compliance documentation.'],
    ],
  },
  {
    slug: 'accounting',
    name: 'Accounting & tax firms',
    who: 'CPA firms, tax preparers, bookkeepers and wealth advisors',
    title: 'Keep client data safe.',
    accent: 'Meet the Safeguards Rule.',
    lede: 'Tax and financial firms hold exactly what criminals want: Social Security numbers, bank details and returns. Acme Cyber puts the required safeguards in place and helps you document them in your written security plan.',
    regulation: 'FTC Safeguards Rule',
    regSummary: 'Under the FTC Safeguards Rule, tax preparers and many financial firms must keep a written information security program: a qualified individual in charge, a written risk assessment, access controls, encryption, multi-factor authentication, monitoring, regular testing, staff training, oversight of service providers and a written incident response plan. The IRS also expects tax professionals to maintain a written information security plan (WISP).',
    pains: [
      ['Tax season is attack season', 'Phishing and account takeover attempts spike exactly when your team is busiest.'],
      ['The written security plan is overdue', 'The Safeguards Rule and the IRS expect a written plan, and many small firms have not finished one.'],
      ['Client trust is the business', 'One breach notice to clients can undo years of referrals.'],
    ],
    map: [
      ['Written risk assessment', 'Our assessment produces a documented risk review you can keep with your security program.'],
      ['Multi-factor authentication', 'Enforced on every account in the employee portal.'],
      ['Encryption in transit and at rest', 'Encrypted email and encrypted drive storage for client files.'],
      ['Monitoring and logging', '24/7 SOC monitoring with SIEM log auditing of user activity.'],
      ['Regular testing', 'Continuous monitoring plus penetration testing and vulnerability reviews.'],
      ['Staff training', 'Awareness training focused on tax-season phishing.'],
      ['Written incident response plan', 'We help you write it and we run it if something happens.'],
    ],
    faq: [
      ['Does the Safeguards Rule apply to small firms?', 'It applies to tax preparers and many other financial firms regardless of size, though some requirements are relaxed for firms holding information on fewer than 5,000 consumers. Confirm your obligations with your attorney.'],
      ['Can you help with our WISP?', 'Yes. Our assessment and reports give you the technical sections, and we help you keep them current.'],
      ['Will this slow my team down during tax season?', 'No. We schedule changes around your busy periods, and multi-factor sign-in takes seconds once set up.'],
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CYBER INSURANCE READINESS CHECK (/readiness). Controls that cyber insurers
// commonly ask about. `level` sets the weight: critical | high | medium.
// ─────────────────────────────────────────────────────────────────────────────
export const READINESS = [
  { id: 'mfa_email', level: 'critical', q: 'Is multi-factor authentication (MFA) required for everyone’s email?', fix: 'Turn on MFA for every mailbox.', service: 'Web Fortress portal' },
  { id: 'mfa_remote', level: 'critical', q: 'Is MFA required for remote access and administrator accounts?', fix: 'Require MFA for VPN, remote desktop and every admin login.', service: 'Web Fortress portal' },
  { id: 'rdp', level: 'critical', q: 'Is remote desktop (RDP) closed to the internet, with remote access only through a VPN or secure gateway?', fix: 'Close exposed remote desktop ports and route remote access through a secured gateway.', service: 'Security Snapshot' },
  { id: 'edr', level: 'critical', q: 'Do all computers run endpoint detection and response (EDR) or next-generation antivirus?', fix: 'Deploy EDR on every workstation and server, with alerts monitored.', service: '24/7 SOC monitoring' },
  { id: 'backup_offline', level: 'critical', q: 'Are backups kept offline, immutable or otherwise separate from your main network?', fix: 'Keep at least one backup copy that ransomware cannot reach or change.', service: 'Verified backups' },
  { id: 'backup_tested', level: 'high', q: 'Have you successfully tested restoring from backup in the last six months?', fix: 'Run and document a restore test at least twice a year.', service: 'Verified backups' },
  { id: 'patching', level: 'high', q: 'Are critical security updates installed within 30 days?', fix: 'Set a patching schedule and track exceptions.', service: 'Security Operations' },
  { id: 'admin', level: 'high', q: 'Do staff use standard accounts day to day, with admin rights limited to a few people?', fix: 'Remove local admin rights from everyday accounts.', service: 'Web Fortress portal' },
  { id: 'training', level: 'high', q: 'Does every employee complete security awareness training at least once a year?', fix: 'Train all staff yearly and at onboarding.', service: 'Awareness training' },
  { id: 'irp', level: 'high', q: 'Do you have a written incident response plan?', fix: 'Write down who does what in the first hours of an incident.', service: 'Security Operations' },
  { id: 'phish_test', level: 'medium', q: 'Do you run phishing simulations to test staff?', fix: 'Run periodic phishing simulations and follow up with short training.', service: 'Awareness training' },
  { id: 'email_auth', level: 'medium', q: 'Is your email domain protected with SPF, DKIM and DMARC?', fix: 'Publish SPF, DKIM and a DMARC policy to stop spoofing.', service: 'Security Snapshot' },
  { id: 'encryption', level: 'medium', q: 'Are laptops and sensitive files encrypted?', fix: 'Turn on full-disk encryption and keep sensitive files on an encrypted drive.', service: 'Encrypted drive' },
  { id: 'passwords', level: 'medium', q: 'Does your team use a password manager, with unique passwords for every account?', fix: 'Roll out a company password manager.', service: 'Web Fortress portal' },
  { id: 'monitoring', level: 'medium', q: 'Is someone watching security alerts and logs, including nights and weekends?', fix: 'Have security alerts monitored around the clock.', service: '24/7 SOC monitoring' },
];
