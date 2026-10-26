// Sol chat client. Streams answers from /api/chat (Claude); if the endpoint is
// unavailable it falls back to the offline intents so the widget never goes dead.
import { match, START } from './intents.js';
import { PRESETS, bookHref } from '../data/site.js';
import { copy, reduceMotion } from './ui.js';

const MAX_TURNS = 20; // keep in step with the server limit
let aiDown = false;   // shared across widgets: stop calling the API after it reports unavailable

function runAction(act) {
  if (act.href) return (location.href = act.href);
  if (act.copy) return copy(act.copy, 'Copied');
  if (act.plan) {
    const ids = act.plan === 'all' ? PRESETS.all : act.plan;
    if (window.acmePlan) {
      if (ids.length) window.acmePlan.set(ids);
      window.acmePlan.root.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
    } else {
      location.href = '/plan' + (ids.length ? '?needs=' + ids.join(',') : '');
    }
  }
}

export function initChat(root) {
  const msgs = root.querySelector('.msgs'), quick = root.querySelector('.quick');
  const form = root.querySelector('.chat-in'), input = form.querySelector('input'), send = form.querySelector('button');
  const history = []; // {role, content} for the API
  let busy = false;

  // Hand off to a person: book a call, or open the contact form with the chat attached.
  const handoff = root.querySelector('.handoff');
  if (handoff) {
    handoff.querySelector('.handoff-book').href = bookHref;
    handoff.querySelector('.handoff-send').addEventListener('click', () => {
      const lines = history.filter(m => m.role === 'user').map(m => '- ' + m.content).join('\n');
      const brief = `Questions I asked Sol (the website assistant):\n${lines}\n\nPlease follow up with me.`;
      location.href = `/contact?topic=chat&brief=${encodeURIComponent(brief.slice(0, 3000))}#form`;
    });
  }

  function bubble(who, text, act) {
    const m = document.createElement('div');
    m.className = 'msg ' + who;
    m.textContent = text;
    if (act) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'act'; b.textContent = act.label;
      b.onclick = () => runAction(act);
      m.append(document.createElement('br'), b);
    }
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    return m;
  }

  function chips(list) {
    quick.innerHTML = '';
    (list || []).forEach(q => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = q; b.onclick = () => ask(q);
      quick.appendChild(b);
    });
    msgs.scrollTop = msgs.scrollHeight; // new chips shrink the log; keep the last reply in view
  }

  async function askAI(text) {
    const typing = bubble('b typing', '');
    typing.innerHTML = '<i></i><i></i><i></i>';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-MAX_TURNS) }),
      });
      if (res.status === 503 || res.status === 404) { aiDown = true; throw new Error('unavailable'); }
      if (res.status === 429) { typing.remove(); bubble('b', 'You are sending messages quickly. Please wait a minute and try again.'); return null; }
      if (!res.ok || !res.body) throw new Error('bad response');
      const reader = res.body.getReader(), dec = new TextDecoder();
      let out = '', el = null;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        out += dec.decode(value, { stream: true });
        if (!el) { typing.remove(); el = bubble('b', ''); }
        el.textContent = out;
        msgs.scrollTop = msgs.scrollHeight;
      }
      if (!el) { typing.remove(); throw new Error('empty'); }
      return out;
    } catch {
      typing.remove();
      return undefined; // signal: use offline answer
    }
  }

  async function ask(text) {
    text = text.trim().slice(0, 1000);
    if (!text || busy) return;
    busy = true; send.disabled = true;
    bubble('u', text); input.value = ''; chips();
    history.push({ role: 'user', content: text });
    if (handoff) handoff.hidden = false;

    const local = match(text);
    // Emergencies always get the vetted answer immediately.
    let reply = local.id === 'emergency' || aiDown ? undefined : await askAI(text);
    if (reply === undefined) {
      if (!reduceMotion()) await new Promise(r => setTimeout(r, 450));
      bubble('b', local.a, local.act);
      reply = local.a;
    } else if (reply && local.act && local.id !== 'fallback') {
      // AI answered; still offer the matching shortcut button.
      bubble('b', 'Shortcut:', local.act);
    }
    if (reply) history.push({ role: 'assistant', content: reply });
    else history.pop();
    chips(local.q || START);
    busy = false; send.disabled = false;
    input.focus({ preventScroll: true });
  }

  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  bubble('b', "Hi, I'm Sol, Acme Cyber's assistant. Ask me anything about protecting your business, our services or pricing. If you think you've been hacked, tell me and I'll tell you what to do right now.");
  chips(START);
  return { focus: () => input.focus() };
}

export function initFloatingChat() {
  const panel = document.getElementById('solPanel'), fab = document.getElementById('solFab');
  if (!panel || !fab) return;
  let chat;
  const toggle = open => {
    if (open && !chat) chat = initChat(panel);
    panel.classList.toggle('open', open);
    fab.classList.toggle('hide', open);
    fab.setAttribute('aria-expanded', open);
    if (open) setTimeout(() => chat.focus(), 250); else fab.focus();
  };
  fab.addEventListener('click', () => toggle(true));
  panel.querySelector('.chat-x').addEventListener('click', () => toggle(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) toggle(false); });
  document.querySelectorAll('[data-open-chat]').forEach(b => b.addEventListener('click', () => toggle(true)));
}
