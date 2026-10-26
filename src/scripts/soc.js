// Simulated SOC feed (labeled as a demo in the markup).
import { reduceMotion } from './ui.js';

const SCRIPT = [
  ['info', 'Portal login verified · user j.miller · MFA ok', 0],
  ['info', 'Backup snapshot verified · drive-02 · checksum match', 0],
  ['warn', 'Failed logins x14 on portal from 185.220.x.x', 0],
  ['info', 'Analyst picked up alert #4471 · triage started', 1],
  ['crit', 'Credential stuffing confirmed · 3 accounts targeted', 1],
  ['ok',   'Source IP blocked at edge · accounts forced to reset', 2],
  ['info', 'SSL certificate check · valid (Google Trust)', 0],
  ['warn', 'Phishing email reported by staff · quarantined', 1],
  ['ok',   'Sender domain blocked tenant-wide', 2],
  ['info', 'Weekly report generated · 0 open critical findings', 3],
  ['warn', 'Unusual file encryption rate on workstation WS-17', 1],
  ['crit', 'Ransomware behaviour · WS-17 isolated from network', 2],
  ['ok',   'WS-17 restored from verified backup · 11 min', 2],
  ['info', 'Incident summary sent to owner · next steps attached', 3],
];

export function initSoc(root) {
  const log = root.querySelector('.log'), steps = [...root.querySelectorAll('.step')];
  const [ev, esc, con] = ['events', 'esc', 'con'].map(k => root.querySelector(`[data-st=${k}]`));
  const st = { e: 0, esc: 0, con: 0 };
  let i = 0;

  function push() {
    const [sev, msg, stage] = SCRIPT[i++ % SCRIPT.length];
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = `<time>${new Date().toTimeString().slice(0, 8)}</time><span class="sev ${sev}">${sev.toUpperCase()}</span><span></span>`;
    line.lastChild.textContent = msg;
    log.appendChild(line);
    while (log.children.length > 16) log.firstChild.remove();
    st.e += 37 + (Math.random() * 90 | 0);
    if (sev === 'crit' || sev === 'warn') st.esc++;
    if (sev === 'ok') st.con++;
    ev.textContent = st.e.toLocaleString(); esc.textContent = st.esc; con.textContent = st.con;
    steps.forEach((s, n) => s.classList.toggle('active', n === stage));
  }

  for (let n = 0; n < 7; n++) push();
  if (reduceMotion()) return;
  let timer;
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting) timer = setInterval(push, 1600);
  }).observe(log);
}
