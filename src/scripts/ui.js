// Site-wide behavior: mobile menu, toast, copy-to-clipboard, card effects.
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}

export async function copy(text, ok = 'Copied') {
  try { await navigator.clipboard.writeText(text); toast(ok); }
  catch { toast('Copy failed. Select the text and press Ctrl+C.'); }
}

export function initUI() {
  const hdr = document.querySelector('.hdr');
  const onScroll = () => hdr?.classList.toggle('compact', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const nav = document.getElementById('nav'), btn = document.getElementById('menuBtn');
  const setOpen = open => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn?.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav?.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('open')) setOpen(false); });

  document.querySelectorAll('[data-copy]').forEach(b =>
    b.addEventListener('click', () => copy(b.dataset.copy, b.dataset.copyOk || 'Copied')));

  document.querySelectorAll('.product').forEach(p => p.addEventListener('pointermove', e => {
    const r = p.getBoundingClientRect();
    p.style.setProperty('--mx', e.clientX - r.left + 'px');
    p.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  document.querySelectorAll('.bars').forEach(bars => {
    for (let i = 0; i < 28; i++) {
      const b = document.createElement('b');
      if (i === 19) b.className = 'hot';
      b.style.height = 25 + Math.random() * 75 + '%';
      b.style.animationDelay = -Math.random() * 2.4 + 's';
      bars.appendChild(b);
    }
  });
}
