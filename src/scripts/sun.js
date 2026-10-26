// Hero "sun and shield": incoming threats are deflected by the shield ring.
// Cursor brightens the shield; click/tap fires a pulse. Pauses when off-screen.
import { reduceMotion } from './ui.js';

export function initSun(cv, countEl, hintEl) {
  const ctx = cv.getContext('2d'), host = cv.parentElement, reduce = reduceMotion();
  let W, H, cx, cy, R, shieldR, mx = -1e4, my = -1e4, t = 0, running = true, count = 0;
  const threats = [], sparks = [], waves = [];

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2), r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const wide = W > 1100;
    cx = wide ? W * 0.78 : W * 0.9; cy = wide ? H * 0.42 : H * 0.2;
    R = wide ? Math.min(W, H) * 0.136 : Math.min(W * 0.2, 110); shieldR = R * 1.75;
    cv.style.opacity = wide ? 1 : 0.7;
  }
  function spawn() {
    const a = Math.random() * Math.PI * 2, d = Math.max(W, H) * 0.75;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    const sp = 1.4 + Math.random() * 1.8, ang = Math.atan2(cy - y, cx - x) + (Math.random() - .5) * .25;
    threats.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, trail: [] });
  }
  function burst(x, y, n, hue) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = Math.random() * 3 + .6;
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hue });
    }
  }
  function deflect(th) {
    burst(th.x, th.y, 14, 40 + Math.random() * 10);
    count++;
    if (countEl) countEl.textContent = count.toLocaleString();
  }
  host.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  host.addEventListener('pointerleave', () => { mx = my = -1e4; });
  host.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button')) return;
    const r = cv.getBoundingClientRect();
    waves.push({ r: shieldR * .6, life: 1 });
    burst(e.clientX - r.left, e.clientY - r.top, 10, 45);
  });

  function frame() {
    t++;
    ctx.clearRect(0, 0, W, H);
    const near = mx > -1e3;
    const sx = cx + (near ? (mx - cx) * .03 : 0), sy = cy + (near ? (my - cy) * .03 : 0);

    // ambient glow
    let g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 5);
    g.addColorStop(0, 'rgba(200,165,90,.28)'); g.addColorStop(.35, 'rgba(200,165,90,.04)'); g.addColorStop(1, 'rgba(8,19,31,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // corona rays
    ctx.save(); ctx.translate(sx, sy); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 90; i++) {
      const a = i / 90 * Math.PI * 2 + t * .0012;
      const n = Math.sin(i * 1.7 + t * .021) * Math.sin(i * .53 - t * .013);
      const len = R * (1.12 + .38 * (n * .5 + .5));
      ctx.strokeStyle = `rgba(230,${195 + (n * 25 | 0)},140,${.05 + .1 * (n * .5 + .5)})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * .95, Math.sin(a) * R * .95); ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.stroke();
    }
    ctx.restore();

    // core
    g = ctx.createRadialGradient(sx - R * .3, sy - R * .3, R * .1, sx, sy, R);
    g.addColorStop(0, '#fbf4e0'); g.addColorStop(.4, '#e6cf97'); g.addColorStop(.8, '#c8a55a'); g.addColorStop(1, '#7d5f1e');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, R, 0, 7); ctx.fill();

    // drifting hot spots
    ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, R, 0, 7); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const a = t * .003 * (i % 2 ? 1 : -1) + i * 1.3, d = R * (.25 + .12 * i);
      const hx = sx + Math.cos(a) * d, hy = sy + Math.sin(a) * d * .7;
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * .45);
      hg.addColorStop(0, 'rgba(255,236,180,.22)'); hg.addColorStop(1, 'rgba(255,236,180,0)');
      ctx.fillStyle = hg; ctx.fillRect(sx - R, sy - R, R * 2, R * 2);
    }
    ctx.restore();

    // shield ring
    const ca = Math.atan2(my - sy, mx - sx);
    ctx.save(); ctx.translate(sx, sy);
    ctx.setLineDash([2, 10]); ctx.lineDashOffset = -t * .3;
    ctx.strokeStyle = 'rgba(230,207,151,.35)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(0, 0, shieldR, 0, 7); ctx.stroke();
    ctx.setLineDash([]);
    for (let k = 0; k < 3; k++) {
      const a0 = t * .006 + k * 2.094;
      ctx.strokeStyle = 'rgba(200,165,90,.55)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, shieldR, a0, a0 + .5); ctx.stroke();
    }
    if (near) {
      const px = Math.cos(ca) * shieldR, py = Math.sin(ca) * shieldR;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 90);
      grd.addColorStop(0, 'rgba(230,207,151,.9)'); grd.addColorStop(1, 'rgba(230,207,151,0)');
      ctx.strokeStyle = grd; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, shieldR, ca - .6, ca + .6); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(243,241,236,.06)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, shieldR * 1.45, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, shieldR * 2.1, 0, 7); ctx.stroke();
    ctx.restore();

    // pulse waves
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i]; w.r += 9; w.life -= .02;
      ctx.strokeStyle = `rgba(230,207,151,${w.life * .6})`; ctx.lineWidth = 3 * w.life;
      ctx.beginPath(); ctx.arc(sx, sy, w.r, 0, 7); ctx.stroke();
      for (let j = threats.length - 1; j >= 0; j--) {
        const th = threats[j];
        if (Math.abs(Math.hypot(th.x - sx, th.y - sy) - w.r) < 14) { deflect(th); threats.splice(j, 1); }
      }
      if (w.life <= 0) waves.splice(i, 1);
    }

    // threats
    if (t % 22 === 0 && threats.length < 26) spawn();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = threats.length - 1; i >= 0; i--) {
      const th = threats[i];
      th.trail.push(th.x, th.y); if (th.trail.length > 24) th.trail.splice(0, 2);
      th.x += th.vx; th.y += th.vy;
      ctx.strokeStyle = 'rgba(255,90,60,.5)'; ctx.lineWidth = 1.4; ctx.beginPath();
      for (let k = 0; k < th.trail.length; k += 2) ctx[k ? 'lineTo' : 'moveTo'](th.trail[k], th.trail[k + 1]);
      ctx.lineTo(th.x, th.y); ctx.stroke();
      ctx.fillStyle = '#ff5a3c'; ctx.beginPath(); ctx.arc(th.x, th.y, 2.2, 0, 7); ctx.fill();
      if (Math.hypot(th.x - sx, th.y - sy) < shieldR) {
        const a = Math.atan2(th.y - sy, th.x - sx);
        ctx.strokeStyle = 'rgba(255,230,160,.95)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(sx, sy, shieldR, a - .18, a + .18); ctx.stroke();
        deflect(th); threats.splice(i, 1);
      }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.x += s.vx; s.y += s.vy; s.vx *= .95; s.vy *= .95; s.life -= .025;
      ctx.fillStyle = `hsla(${s.hue},80%,68%,${s.life})`; ctx.fillRect(s.x, s.y, 2, 2);
      if (s.life <= 0) sparks.splice(i, 1);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (running && !reduce) requestAnimationFrame(frame);
  }

  if (hintEl && matchMedia('(pointer:coarse)').matches) hintEl.textContent = 'Tap the hero to fire a shield pulse.';
  size();
  addEventListener('resize', size);
  if (reduce) { frame(); if (hintEl) hintEl.hidden = true; return; }
  new IntersectionObserver(([e]) => {
    const was = running; running = e.isIntersecting;
    if (running && !was) requestAnimationFrame(frame);
  }).observe(cv);
  requestAnimationFrame(frame);
}
