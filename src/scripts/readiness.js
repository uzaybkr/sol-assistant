// Cyber insurance readiness check: score + gaps from yes / no / unsure answers.
// Nothing is sent anywhere unless the visitor chooses "Send my results".
import { READINESS, bookHref } from '../data/site.js';

const WEIGHT = { critical: 10, high: 7, medium: 4 };
const LEVEL_ORDER = { critical: 0, high: 1, medium: 2 };

// answers: { [id]: 'yes' | 'no' | 'unsure' }. "Unsure" counts as a gap: insurers want a clear yes.
export function scoreReadiness(answers) {
  const total = READINESS.reduce((s, q) => s + WEIGHT[q.level], 0);
  const earned = READINESS.reduce((s, q) => s + (answers[q.id] === 'yes' ? WEIGHT[q.level] : 0), 0);
  const gaps = READINESS.filter(q => answers[q.id] !== 'yes')
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  const score = Math.round(earned / total * 100);
  const criticalGaps = gaps.filter(g => g.level === 'critical').length;
  const band = criticalGaps === 0 && score >= 85 ? 'ready'
    : criticalGaps <= 1 && score >= 60 ? 'gaps' : 'risk';
  return { score, gaps, criticalGaps, band };
}

const BANDS = {
  ready: ['Likely ready', 'You have the controls insurers most often ask for. Keep the evidence handy for your renewal.'],
  gaps: ['Gaps an insurer may flag', 'You cover a lot, but the gaps below commonly lead to exclusions, higher premiums or extra questions.'],
  risk: ['At risk at renewal', 'Several controls insurers commonly require are missing. Expect a higher premium, exclusions or a declined application until they are fixed.'],
};

export function initReadiness(root) {
  const form = root.querySelector('form'), out = root.querySelector('[data-result]');
  const bar = root.querySelector('[data-progress]'), count = root.querySelector('[data-count]');
  const answers = () => Object.fromEntries(READINESS.map(q => [q.id, form.elements[q.id]?.value || '']));

  form.addEventListener('change', () => {
    const n = Object.values(answers()).filter(Boolean).length;
    count.textContent = `${n} of ${READINESS.length} answered`;
    bar.style.width = n / READINESS.length * 100 + '%';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const a = answers();
    const missing = READINESS.find(q => !a[q.id]);
    if (missing) {
      const el = form.querySelector(`[name="${missing.id}"]`);
      el.closest('fieldset').scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
      count.textContent = 'Please answer every question (choose "Not sure" if you don’t know).';
      return;
    }
    const r = scoreReadiness(a);
    const [title, text] = BANDS[r.band];
    out.hidden = false;
    out.dataset.band = r.band;
    out.querySelector('[data-score]').textContent = r.score;
    out.querySelector('[data-title]').textContent = title;
    out.querySelector('[data-text]').textContent = text;
    const list = out.querySelector('[data-gaps]');
    list.replaceChildren(...r.gaps.map(g => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="lvl ${g.level}">${g.level}</span><div><b></b><p></p><small></small></div>`;
      li.querySelector('b').textContent = g.q;
      li.querySelector('p').textContent = (a[g.id] === 'unsure' ? 'Not sure. ' : '') + g.fix;
      li.querySelector('small').textContent = 'Acme Cyber: ' + g.service;
      return li;
    }));
    out.querySelector('[data-nogaps]').hidden = r.gaps.length > 0;
    const brief = `Cyber insurance readiness check\nScore: ${r.score}/100 (${title})\n` +
      (r.gaps.length ? `Gaps:\n${r.gaps.map(g => `- [${g.level}] ${g.fix}`).join('\n')}` : 'No gaps found.');
    out.querySelector('[data-send]').href = `/contact?topic=readiness&brief=${encodeURIComponent(brief)}#form`;
    out.querySelector('[data-book]').href = bookHref;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
