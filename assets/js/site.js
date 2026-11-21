/* Ermias Gelaye Gaga — career site behaviour.
 * Also provides the small ARC.* helpers the shared chat assistant (/assets/shared/chat) expects. */
'use strict';

window.ARC = window.ARC || {};

ARC.config = {
    CONTACT_EMAIL: 'ermiasgelaye@gmail.com',
    // Optional server-side AI endpoint (see Photography/server/chat-api/README.md). Never put API keys here.
    CHAT_API_URL: '',
    ASSISTANT: {
        historyKey: 'careerChatHistory_v1',
        keepWords: ['photo', 'photos', 'photography', 'photograph', 'picture', 'pictures'],
        subjectPattern: /\b(he|his|him|ermias|gaga)\b/,
        subjectTopics: ['about', 'project'],
        unknownTail: `\n\nI can help with Ermias's background, skills, projects and experience, or data science questions. For anything else about working with him, the **contact form** reaches him directly.`,
        welcome: `Hi! 👋 I'm Ermias's **portfolio assistant**.\n\nAsk me about his background, skills, projects, experience or education, or a data science question (machine learning, statistics, SQL, visualization, careers). If I'm not sure about something, I'll say so.`,
        greeting: `Hello! 👋 Ask me about Ermias's experience, skills and projects, or any data science question.`,
        starters: ["Tell me about Ermias", 'What are his technical skills?', 'Show me his projects', 'Explain overfitting', 'How do I contact him?', 'Download his CV'],
        helpText: (n) => `I'm the portfolio assistant for Ermias Gelaye Gaga, with a curated knowledge base (${n}+ topics). I can help with:\n\n` +
            `- **About Ermias**: background, experience, education, skills, projects, contact and CV\n` +
            `- **Data science**: machine learning, model evaluation, statistics, A/B testing, SQL, Python, visualization, EDA\n` +
            `- **Careers**: getting started, building a portfolio, interview preparation\n` +
            `- **Calculators**: arithmetic and unit conversions\n\n` +
            `Ask follow-ups like “tell me more”. If I don't know something reliably, I'll say so rather than guess.`
    }
};

/* ---------- Small utilities (shared-chat contract) ---------- */
ARC.util = (() => {
    const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
    const store = {
        get(k, f = null) { try { const v = localStorage.getItem(k); return v === null ? f : v; } catch { return f; } },
        set(k, v) { try { localStorage.setItem(k, String(v)); } catch { /* blocked */ } },
        remove(k) { try { localStorage.removeItem(k); } catch { /* blocked */ } },
        getJSON(k, f = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
        setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* blocked */ } }
    };
    return { escapeHtml, store };
})();

ARC.toast = (message, { type = 'info', icon, timeout = 3500 } = {}) => {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.className = 'toast-stack';
        stack.setAttribute('role', 'status');
        stack.setAttribute('aria-live', 'polite');
        document.body.appendChild(stack);
    }
    const icons = { info: 'fa-circle-info', success: 'fa-check', error: 'fa-triangle-exclamation' };
    const el = document.createElement('div');
    el.className = `toast-x ${type}`;
    el.innerHTML = `<span class="toast-icon"><i class="fas ${icon || icons[type]}" aria-hidden="true"></i></span><div></div>`;
    el.lastElementChild.textContent = message;
    stack.appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 260); }, timeout);
};

/* ---------- Theme ---------- */
function initTheme() {
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const apply = (mode) => {
        root.dataset.theme = mode;
        btn?.setAttribute('aria-pressed', String(mode === 'dark'));
        btn?.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        if (btn) btn.innerHTML = `<i class="fas ${mode === 'dark' ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#0b1020' : '#ffffff');
    };
    apply(root.dataset.theme || 'light');
    btn?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        ARC.util.store.set('theme', next);
        apply(next);
    });
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
        if (!ARC.util.store.get('theme')) apply(e.matches ? 'dark' : 'light');
    });
}

/* ---------- Navigation ---------- */
function initNav() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const setOpen = (open) => {
        links.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.innerHTML = `<i class="fas ${open ? 'fa-times' : 'fa-bars'}" aria-hidden="true"></i>`;
    };
    toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!links.classList.contains('open')); });
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', (e) => { if (links.classList.contains('open') && !links.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const anchors = [...links.querySelectorAll('a[href^="#"]')];
    const sections = anchors.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
            if (!en.isIntersecting) return;
            anchors.forEach((a) => {
                const on = a.getAttribute('href') === `#${en.target.id}`;
                a.classList.toggle('active', on);
                on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
            });
        }), { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => io.observe(s));
    }
}

/* ---------- Typed role line (deletes, then types the next title) ---------- */
function initRoles() {
    const el = document.getElementById('roleText');
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const roles = JSON.parse(el.dataset.roles || '[]');
    if (roles.length < 2) return;
    let r = 0, i = roles[0].length, dir = -1;
    const tick = () => {
        i += dir;
        el.textContent = roles[r].slice(0, i);
        if (dir < 0 && i === 0) { r = (r + 1) % roles.length; dir = 1; return setTimeout(tick, 300); }
        if (dir > 0 && i === roles[r].length) { dir = -1; return setTimeout(tick, 2400); }
        return setTimeout(tick, dir < 0 ? 30 : 65);
    };
    setTimeout(tick, 2800);
}

/* ---------- Scroll-in animations: reveal, skills, counters ---------- */
function initOnView() {
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (!Number.isFinite(target)) return;
        const start = performance.now(), dur = 1400;
        const step = (t) => {
            const p = Math.min(1, (t - start) / dur);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const show = (el) => {
        el.classList.add('in');
        el.querySelectorAll('.ring .fill').forEach((c) => { c.style.strokeDashoffset = String(339.3 * (1 - (+c.dataset.value) / 100)); });
        el.querySelectorAll('.bar span').forEach((b) => { b.style.width = `${b.dataset.value}%`; });
        el.querySelectorAll('[data-count]').forEach(animateCounter);
    };
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(show); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
}

/* ---------- Project filters ---------- */
function initProjects() {
    const chips = [...document.querySelectorAll('.filters .chip')];
    const cards = [...document.querySelectorAll('.project')];
    chips.forEach((chip) => {
        const f = chip.dataset.filter;
        const n = f === 'all' ? cards.length : cards.filter((c) => c.dataset.tags.split(' ').includes(f)).length;
        chip.querySelector('.count').textContent = n;
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
            cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.tags.split(' ').includes(f)); });
            document.getElementById('projectStatus').textContent = `Showing ${n} project${n === 1 ? '' : 's'}`;
        });
    });
}

/* ---------- Contact form (Formspree) ---------- */
ARC.contact = {
    init() {
        const form = document.getElementById('contactForm');
        const out = document.getElementById('formResponse');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            out.innerHTML = '';
            if (!form.checkValidity()) { form.reportValidity(); return; }
            const btn = form.querySelector('button[type="submit"]');
            const label = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
            try {
                const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
                if (!res.ok) throw new Error(String(res.status));
                out.innerHTML = '<div class="alert ok" role="status"><i class="fas fa-check-circle" aria-hidden="true"></i> Thanks, your message was sent. Ermias usually replies within 24 hours.</div>';
                form.reset();
            } catch {
                const m = ARC.util.escapeHtml(ARC.config.CONTACT_EMAIL);
                out.innerHTML = `<div class="alert err" role="alert"><i class="fas fa-exclamation-circle" aria-hidden="true"></i> Sorry, the message couldn't be sent. Please try again or email <a href="mailto:${m}">${m}</a>.</div>`;
            } finally {
                btn.disabled = false;
                btn.innerHTML = label;
            }
        });
    },
    /** Used by the chat assistant's "contact" action. */
    prefill({ type } = {}) {
        const form = document.getElementById('contactForm');
        if (!form) return;
        const subjects = { hire: 'Job opportunity', collaborate: 'Collaboration', project: 'Project inquiry', other: '' };
        if (subjects[type] && !form.subject.value) form.subject.value = subjects[type];
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => form.name?.focus({ preventScroll: true }), 600);
    }
};

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    initTheme();
    initNav();
    initRoles();
    initOnView();
    initProjects();
    ARC.contact.init();
    if (ARC.chat) {
        ARC.chat.init();
        document.querySelectorAll('[data-open-chat]').forEach((b) => b.addEventListener('click', () => ARC.chat.open()));
    }
    const top = document.getElementById('backToTop');
    const upd = () => { top.hidden = window.scrollY < 700; };
    window.addEventListener('scroll', upd, { passive: true });
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    upd();
});
