// Plan builder: team size + needs -> coverage score, packages, and an emailable brief.
import { NEEDS, PACKAGES, PRESETS, EMAIL } from '../data/site.js';
import { copy } from './ui.js';

export const coverage = ids => Math.min(100, NEEDS.filter(n => ids.includes(n.id)).reduce((s, n) => s + n.w, 0));
export const packagesFor = ids => [...new Set(NEEDS.filter(n => ids.includes(n.id)).map(n => n.pkg))];

export function resolveNeeds(search) {
  const p = new URLSearchParams(search);
  if (PRESETS[p.get('preset')]) return PRESETS[p.get('preset')];
  const ids = (p.get('needs') || '').split(',').filter(id => NEEDS.some(n => n.id === id));
  return ids.length ? ids : ['email', 'drive', 'soc', 'backup'];
}

export function initPlan(root) {
  const $ = s => root.querySelector(s);
  const team = $('#team'), circ = 2 * Math.PI * 54;
  let brief = '';

  const picked = () => NEEDS.filter(n => $('#n-' + n.id).checked).map(n => n.id);

  function update() {
    const size = +team.value, ids = picked(), pct = coverage(ids), used = packagesFor(ids);
    const sizeLabel = size === 250 ? '250+' : String(size);
    $('#teamOut').textContent = sizeLabel;
    team.style.setProperty('--p', (size - 1) / 249 * 100 + '%');
    $('#gNum').textContent = pct + '%';
    $('#gFill').style.strokeDashoffset = circ * (1 - pct / 100);
    const [title, text] = pct >= 90 ? ['Fully covered', 'Every layer is in place. This is how we would protect our own business.']
      : pct >= 60 ? ['Strong perimeter', 'Solid core protection. Add the remaining layers to close the last gaps.']
      : pct >= 30 ? ['Partial coverage', 'A good start, but attackers look for the layer you skipped.']
      : ['Exposed', 'Pick what matters and watch your perimeter close.'];
    $('#gTitle').textContent = title;
    $('#gText').textContent = text;
    $('#plan').innerHTML = Object.entries(PACKAGES).map(([k, v]) =>
      `<div class="plan-item ${used.includes(k) ? 'on' : 'off'}"><span>${v}</span><em>${used.includes(k) ? 'Included' : 'Not selected'}</em></div>`).join('');
    const ind = root.querySelector('input[name=ind]:checked').value;
    brief = `Acme Cyber plan request\nTeam size: ${sizeLabel} people\nIndustry: ${ind}\n` +
      `Packages: ${used.map(k => PACKAGES[k]).join(', ') || 'none yet'}\n` +
      `Needs: ${NEEDS.filter(n => ids.includes(n.id)).map(n => n.label).join(', ') || 'none yet'}\nCoverage score: ${pct}%`;
    $('#brief').textContent = brief;
    $('#sendBrief').href = `/contact?topic=plan&brief=${encodeURIComponent(brief)}`;
    $('#mailBrief').href = `mailto:${EMAIL}?subject=${encodeURIComponent('Protection plan for my team')}&body=${encodeURIComponent(brief)}`;
  }

  function set(ids) {
    NEEDS.forEach(n => { $('#n-' + n.id).checked = ids.includes(n.id); });
    update();
  }

  root.addEventListener('input', update);
  $('#copyBrief').addEventListener('click', () => copy(brief, 'Plan summary copied'));
  set(resolveNeeds(location.search));
  window.acmePlan = { set, root };
}
