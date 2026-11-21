/* ARC Photo Assistant — chat interface.
 * Local answers come from ARC.chatEngine. If ARC.config.CHAT_API_URL is set, questions the
 * knowledge base can't answer confidently are sent to that server endpoint (which holds the
 * AI API key — never put keys in this file). */
'use strict';

ARC.chat = (() => {
    const { escapeHtml, store } = ARC.util;
    const E = ARC.chatEngine;
    const HISTORY_KEY = (ARC.config && ARC.config.ASSISTANT && ARC.config.ASSISTANT.historyKey) || 'arcChatHistory_v2';
    const MAX_HISTORY = 80;

    const SITE = (ARC.config && ARC.config.ASSISTANT) || {};
    const DEFAULT_STARTERS = [
        'Show me photos of Niagara Falls',
        'Explain the exposure triangle',
        'How do I photograph waterfalls?',
        'How much is unlimited access?',
        'Best settings for the Milky Way',
        'Can I buy a print?'
    ];

    const STARTERS = SITE.starters || DEFAULT_STARTERS;

    let el = {};
    let history = [];
    let busy = false;
    const session = E.createSession();

    /* ---------- Safe light-markdown renderer ---------- */
    function md(text) {
        const inline = (s) => escapeHtml(s)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[\s(])_([^_]+)_(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>')
            .replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
        const blocks = String(text).replace(/\r/g, '').split(/\n{2,}/);
        return blocks.map((b) => {
            const lines = b.split('\n');
            if (lines.every((l) => /^\s*[-•]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-•]\s+/, ''))}</li>`).join('')}</ul>`;
            if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
            // mixed block: leading text line(s) followed by a list
            const firstList = lines.findIndex((l) => /^\s*([-•]|\d+\.)\s+/.test(l));
            if (firstList > 0 && lines.slice(firstList).every((l) => /^\s*([-•]|\d+\.)\s+/.test(l))) {
                const ordered = /^\s*\d+\./.test(lines[firstList]);
                const items = lines.slice(firstList).map((l) => `<li>${inline(l.replace(/^\s*([-•]|\d+\.)\s+/, ''))}</li>`).join('');
                return `<p>${lines.slice(0, firstList).map(inline).join('<br>')}</p>${ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`}`;
            }
            if (/^###\s+/.test(b)) return `<h4>${inline(b.replace(/^###\s+/, ''))}</h4>`;
            return `<p>${lines.map(inline).join('<br>')}</p>`;
        }).join('');
    }

    const timeLabel = (ts) => new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const SOURCE_LABEL = { kb: 'Knowledge base', tool: 'Calculator', portfolio: 'Portfolio search', ai: 'AI model', assistant: 'Assistant', system: 'System' };

    /* ---------- Rendering ---------- */
    function renderMessage(m) {
        const wrap = document.createElement('div');
        wrap.className = `msg ${m.role === 'user' ? 'user' : 'bot'}${m.error ? ' error' : ''}`;
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        if (m.role === 'user') bubble.textContent = m.text;
        else bubble.innerHTML = md(m.text);
        wrap.appendChild(bubble);

        const btns = [
            ...(m.actions || []).map((a) => ({ label: a.label, action: a.action })),
            ...(m.alternatives || []).map((a) => ({ label: a.title, ask: a.q?.[0] || a.title })),
            ...(m.related || []).map((a) => ({ label: a.title, ask: a.q?.[0] || a.title }))
        ].slice(0, 5);
        if (btns.length) {
            const row = document.createElement('div');
            row.className = 'msg-actions';
            btns.forEach((b) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = b.label;
                if (b.action) btn.dataset.action = b.action; else btn.dataset.ask = b.ask;
                row.appendChild(btn);
            });
            wrap.appendChild(row);
        }
        const meta = document.createElement('div');
        meta.className = 'msg-meta';
        meta.innerHTML = `<time datetime="${new Date(m.ts).toISOString()}">${timeLabel(m.ts)}</time>${m.role !== 'user' && m.source && SOURCE_LABEL[m.source] ? `<span class="msg-source">${SOURCE_LABEL[m.source]}</span>` : ''}`;
        wrap.appendChild(meta);
        el.log.appendChild(wrap);
    }

    const scrollDown = () => { el.log.scrollTop = el.log.scrollHeight; };

    function setSuggestions(list) {
        el.suggest.innerHTML = '';
        [...new Set(list)].slice(0, 6).forEach((q) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = q;
            b.dataset.ask = q;
            el.suggest.appendChild(b);
        });
        el.suggest.hidden = !el.suggest.children.length;
    }

    function welcome() {
        const text = SITE.welcome || `Hi! 👋 I'm the **ARC-NATURE photo assistant**.\n\nAsk me about the photos in this portfolio, downloads and prints, or anything photography — settings, composition, gear and editing. I'll tell you if I'm not sure about something.`;
        const m = { role: 'bot', text, ts: Date.now(), source: 'assistant' };
        renderMessage(m);
        setSuggestions(STARTERS);
    }

    function persist() {
        history = history.slice(-MAX_HISTORY);
        store.setJSON(HISTORY_KEY, history.map(({ role, text, ts, source, error }) => ({ role, text, ts, source, error })));
        try { sessionStorage.setItem('arcChatLastEntry', session.lastEntryId || ''); } catch { /* ignore */ }
    }

    function push(m) {
        history.push(m);
        renderMessage(m);
        scrollDown();
        persist();
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'msg bot';
        t.innerHTML = '<div class="bubble typing" aria-label="Assistant is typing"><span></span><span></span><span></span></div>';
        el.log.appendChild(t);
        scrollDown();
        return t;
    }

    /* ---------- Remote AI (optional, server-side key) ---------- */
    async function askRemote(question) {
        const url = ARC.config.CHAT_API_URL;
        if (!url) return null;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 25000);
        try {
            const messages = history.filter((m) => !m.error).slice(-10).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text.slice(0, 2000) }));
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages, context: E.contextFor(question) }),
                signal: ctrl.signal
            });
            if (res.status === 429) throw new Error('rate');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (!data || typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('empty');
            return { text: data.reply.trim(), source: 'ai' };
        } catch (err) {
            return { failed: true, reason: err.message === 'rate' ? 'rate' : 'down' };
        } finally {
            clearTimeout(timer);
        }
    }

    /* ---------- Send ---------- */
    async function send(text) {
        const q = String(text || '').trim();
        if (!q || busy) return;
        if (q.length > 600) { ARC.toast('Please keep questions under 600 characters.', { type: 'error' }); return; }
        busy = true;
        el.input.value = '';
        autosize();
        el.send.disabled = true;
        push({ role: 'user', text: q, ts: Date.now() });
        const typing = showTyping();
        const started = performance.now();

        let reply;
        try {
            const local = E.answer(q, session);
            const strongLocal = local.confidence === 'high' || ['tool', 'portfolio', 'assistant'].includes(local.source);

            if (!strongLocal && ARC.config.CHAT_API_URL) {
                const remote = await askRemote(q);
                if (remote && !remote.failed) reply = { ...remote, related: local.entryId ? (local.related || []) : [] };
                else if (remote?.failed) {
                    const note = remote.reason === 'rate' ? 'The AI service is busy right now' : 'The AI service is unavailable right now';
                    reply = local.text
                        ? { ...local, text: `_${note}, so here's the closest answer from my knowledge base:_\n\n${local.text}` }
                        : { text: `${note}, and I don't have a reliable answer in my knowledge base. Please try again in a moment.`, source: 'system', error: true, alternatives: local.alternatives };
                }
            }
            if (!reply) {
                if (!local.text) reply = { text: E.unknownText(local.alternatives), source: 'kb', alternatives: local.alternatives, actions: local.alternatives?.length ? [] : [{ label: 'Open contact form', action: 'contact:other' }] };
                else if (local.confidence === 'medium' && local.source === 'kb' && local.title) reply = { ...local, text: `Here's what I know about **${local.title}** — tell me if you meant something else.\n\n${local.text}` };
                else reply = local;
            }
        } catch (err) {
            console.error('Chat error:', err);
            reply = { text: 'Sorry — something went wrong while answering. Please try rephrasing your question.', source: 'system', error: true };
        }

        // Short, natural delay so the typing indicator doesn't flash.
        const wait = Math.max(0, 380 - (performance.now() - started));
        await new Promise((r) => setTimeout(r, wait));
        typing.remove();

        if (reply.hasMore) reply.actions = [...(reply.actions || []), { label: 'Tell me more', action: 'ask:tell me more' }];
        push({ role: 'bot', ts: Date.now(), ...reply });

        const nextQs = [
            ...(reply.related || []).map((r) => r.q?.[0] || r.title),
            ...(reply.suggest ? STARTERS : [])
        ];
        setSuggestions(nextQs.length ? nextQs : STARTERS.slice(0, 4));
        busy = false;
        el.send.disabled = !el.input.value.trim();
        el.input.focus({ preventScroll: true });
    }

    /* ---------- Actions from buttons ---------- */
    function runAction(action) {
        const [kind, ...rest] = action.split(':');
        const arg = rest.join(':');
        const closeOnMobile = () => { if (window.matchMedia('(max-width: 575.98px)').matches) close(); };
        switch (kind) {
            case 'ask': send(arg); break;
            case 'gallery': {
                const [sub, ...v] = arg.split(':');
                const val = v.join(':');
                closeOnMobile();
                if (sub === 'category') ARC.gallery.set({ category: val, query: '', scroll: true });
                if (sub === 'search') ARC.gallery.set({ category: 'all', query: val, scroll: true });
                if (sub === 'open') ARC.gallery.openBySrc(val);
                break;
            }
            case 'scroll': closeOnMobile(); document.querySelector(arg)?.scrollIntoView({ behavior: 'smooth' }); break;
            case 'contact': closeOnMobile(); ARC.contact?.prefill({ type: arg }); break;
            case 'link': window.open(arg, '_blank', 'noopener'); break;
            case 'purchase': ARC.downloads.openPurchase({ reason: 'general' }); break;
            default: break;
        }
    }

    /* ---------- Open / close ---------- */
    function open() {
        el.panel.hidden = false;
        el.toggle.setAttribute('aria-expanded', 'true');
        scrollDown();
        setTimeout(() => el.input.focus(), 50);
    }
    function close() {
        el.panel.hidden = true;
        el.toggle.setAttribute('aria-expanded', 'false');
        el.toggle.focus({ preventScroll: true });
    }

    function clear() {
        history = [];
        store.remove(HISTORY_KEY);
        Object.assign(session, E.createSession());
        el.log.innerHTML = '';
        welcome();
        el.input.focus();
    }

    function autosize() {
        el.input.style.height = 'auto';
        el.input.style.height = `${Math.min(el.input.scrollHeight, 120)}px`;
    }

    function init() {
        el = {
            toggle: document.getElementById('chatToggle'),
            panel: document.getElementById('chatPanel'),
            log: document.getElementById('chatLog'),
            suggest: document.getElementById('chatSuggest'),
            form: document.getElementById('chatForm'),
            input: document.getElementById('chatInput'),
            send: document.getElementById('chatSend'),
            status: document.getElementById('chatStatus')
        };
        if (!el.toggle || !el.panel) return;

        if (el.status) el.status.textContent = ARC.config.CHAT_API_URL ? 'Knowledge base + AI' : `Knowledge base · ${ARC.KB.length} topics`;

        history = store.getJSON(HISTORY_KEY, []) || [];
        try { session.lastEntryId = sessionStorage.getItem('arcChatLastEntry') || null; } catch { /* ignore */ }
        if (history.length) {
            history.forEach(renderMessage);
            setSuggestions(STARTERS.slice(0, 4));
        } else {
            welcome();
        }

        el.toggle.addEventListener('click', () => (el.panel.hidden ? open() : close()));
        el.panel.querySelector('[data-chat="close"]').addEventListener('click', close);
        el.panel.querySelector('[data-chat="clear"]').addEventListener('click', clear);
        el.form.addEventListener('submit', (e) => { e.preventDefault(); send(el.input.value); });
        el.input.addEventListener('input', () => { autosize(); el.send.disabled = busy || !el.input.value.trim(); });
        el.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(el.input.value); }
        });
        el.panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
        el.panel.addEventListener('click', (e) => {
            const b = e.target.closest('button[data-ask], button[data-action]');
            if (!b || !el.panel.contains(b)) return;
            if (b.dataset.ask) send(b.dataset.ask);
            else runAction(b.dataset.action);
        });
        el.send.disabled = true;
    }

    return { init, open, close, send, md };
})();
