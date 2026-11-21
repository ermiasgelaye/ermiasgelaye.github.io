/* ARC-NATURE PHOTOGRAPHY — shared utilities, theme, navigation, contact form.
 * Loaded first; exposes window.ARC as the app namespace. */
'use strict';

window.ARC = window.ARC || {};

ARC.config = {
    API_BASE_URL: 'https://photo-backend-ten.vercel.app',
    // Publishable keys only. Secret keys must live on the server, never here.
    STRIPE_PUBLIC_KEY: 'pk_live_51Sj9nV02gaqWYHHq2AAYcbU3GQIOy6IB86RUwmJ8QCZIeQbR5UAk7zJHM1wGIMxV3pplDirufziIvMepBLS84J9a00AWlk0NrQ',
    PAYPAL_CLIENT_ID: 'AQ_jpAzGqFSS9drvNKT3bVLm8jDFL_wK9TqyE8vcVWLyNtbV3s3OFnw8AGWT49JkkOus6PKlHBxn1pIh',
    // Optional AI endpoint for the chat assistant (see Photography/server/chat-api/README.md).
    // Leave empty to use only the built-in knowledge base.
    CHAT_API_URL: '',
    FREE_DOWNLOADS_PER_YEAR: 3,
    UNLIMITED_PRICE: '$30.00',
    CONTACT_EMAIL: 'ermiasgelaye@gmail.com',
    PHOTOGRAPHER: 'Ermias Gaga'
};

/* ---------- Utilities ---------- */
ARC.util = (() => {
    const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

    const store = {
        get(key, fallback = null) {
            try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch { return fallback; }
        },
        set(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* storage unavailable */ } },
        remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
        getJSON(key, fallback = null) {
            try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
        },
        setJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ } }
    };

    const debounce = (fn, ms = 250) => {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    };

    const scriptCache = new Map();
    const loadScript = (src, attrs = {}) => {
        if (scriptCache.has(src)) return scriptCache.get(src);
        const p = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src; s.async = true;
            Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
            s.onload = () => resolve();
            s.onerror = () => { scriptCache.delete(src); s.remove(); reject(new Error(`Failed to load ${src}`)); };
            document.head.appendChild(s);
        });
        scriptCache.set(src, p);
        return p;
    };

    const postJSON = async (path, body, { timeout = 12000 } = {}) => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeout);
        try {
            const res = await fetch(`${ARC.config.API_BASE_URL}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: ctrl.signal
            });
            let data = null;
            try { data = await res.json(); } catch { /* non-JSON */ }
            return { ok: res.ok, status: res.status, data };
        } finally {
            clearTimeout(timer);
        }
    };

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

    return { escapeHtml, store, debounce, loadScript, postJSON, isEmail };
})();

/* ---------- Toasts ---------- */
ARC.toast = (message, { type = 'info', icon, timeout = 3500, html = false } = {}) => {
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
    el.innerHTML = `<span class="toast-icon"><i class="fas ${icon || icons[type] || icons.info}" aria-hidden="true"></i></span><div></div>`;
    el.lastElementChild[html ? 'innerHTML' : 'textContent'] = message;
    stack.appendChild(el);
    setTimeout(() => {
        el.classList.add('leaving');
        setTimeout(() => el.remove(), 260);
    }, timeout);
};

/* ---------- Modal helper (focus management, Esc, backdrop click) ---------- */
ARC.modal = (() => {
    let openCount = 0;
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    function open({ html, label = 'Dialog', onClose, dismissible = true } = {}) {
        const returnFocus = document.activeElement;
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop-x';
        backdrop.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-label="${ARC.util.escapeHtml(label)}">
            ${dismissible ? '<button type="button" class="icon-btn modal-close" data-close aria-label="Close"><i class="fas fa-times" aria-hidden="true"></i></button>' : ''}
            ${html}</div>`;
        document.body.appendChild(backdrop);
        openCount++;
        document.body.classList.add('modal-open-lock');

        let closed = false;
        const close = (result) => {
            if (closed) return;
            closed = true;
            document.removeEventListener('keydown', onKey, true);
            backdrop.remove();
            openCount = Math.max(0, openCount - 1);
            if (!openCount && !document.querySelector('.lightbox:not([hidden])')) document.body.classList.remove('modal-open-lock');
            if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
            onClose?.(result);
        };
        const onKey = (e) => {
            if (e.key === 'Escape' && dismissible) { e.stopPropagation(); close(false); }
            if (e.key === 'Tab') {
                const items = [...backdrop.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
                if (!items.length) return;
                const first = items[0], last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener('keydown', onKey, true);
        backdrop.addEventListener('click', (e) => {
            if ((e.target === backdrop && dismissible) || e.target.closest('[data-close]')) close(false);
        });
        const card = backdrop.firstElementChild;
        requestAnimationFrame(() => (card.querySelector('[autofocus]') || card.querySelector(FOCUSABLE))?.focus());
        return { el: card, close };
    }

    const confirm = ({ title, body, confirmText = 'Confirm', cancelText = 'Cancel' }) => new Promise((resolve) => {
        const m = open({
            label: title,
            onClose: (r) => resolve(r === true),
            html: `<h2>${ARC.util.escapeHtml(title)}</h2>${body}
                <div class="modal-actions">
                    <button type="button" class="btn-brand" data-ok>${confirmText}</button>
                    <button type="button" class="btn-outline" data-close>${cancelText}</button>
                </div>`
        });
        m.el.querySelector('[data-ok]').addEventListener('click', () => m.close(true));
    });

    return { open, confirm };
})();

/* ---------- Theme ---------- */
ARC.theme = (() => {
    const root = document.documentElement;
    const apply = (mode) => {
        root.dataset.theme = mode;
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.setAttribute('aria-pressed', String(mode === 'dark'));
            btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            btn.innerHTML = `<i class="fas ${mode === 'dark' ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
        }
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#0d1117' : '#ffffff');
    };
    const init = () => {
        apply(root.dataset.theme || 'light');
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
            ARC.util.store.set('theme', next);
            apply(next);
        });
        // Follow the OS setting until the visitor picks one explicitly.
        window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
            if (!ARC.util.store.get('theme')) apply(e.matches ? 'dark' : 'light');
        });
    };
    return { init };
})();

/* ---------- Navigation ---------- */
ARC.nav = (() => {
    const init = () => {
        const toggle = document.getElementById('navToggle');
        const links = document.getElementById('navLinks');
        if (!toggle || !links) return;
        const setOpen = (open) => {
            links.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.innerHTML = `<i class="fas ${open ? 'fa-times' : 'fa-bars'}" aria-hidden="true"></i>`;
        };
        toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!links.classList.contains('open')); });
        links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
        document.addEventListener('click', (e) => {
            if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
        });

        // Highlight the section in view.
        const anchors = [...links.querySelectorAll('a[href^="#"]')];
        const sections = anchors.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
        if ('IntersectionObserver' in window && sections.length) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((en) => {
                    if (!en.isIntersecting) return;
                    anchors.forEach((a) => {
                        const on = a.getAttribute('href') === `#${en.target.id}`;
                        a.classList.toggle('active', on);
                        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
                    });
                });
            }, { rootMargin: '-45% 0px -50% 0px' });
            sections.forEach((s) => io.observe(s));
        }
    };
    return { init };
})();

/* ---------- Scroll reveal (replaces the AOS dependency) ---------- */
ARC.reveal = () => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach((e) => io.observe(e));
};

/* ---------- Lazy section backgrounds (load ~1 screen before they appear) ---------- */
ARC.lazyBackgrounds = () => {
    const els = document.querySelectorAll('.band');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('bg-in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('bg-in'); io.unobserve(en.target); }
    }), { rootMargin: '100% 0px' });
    els.forEach((e) => io.observe(e));
};

/* ---------- Back to top ---------- */
ARC.backToTop = () => {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const update = () => { btn.hidden = window.scrollY < 600; };
    window.addEventListener('scroll', update, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
};

/* ---------- Contact form (Formspree) ---------- */
ARC.contact = (() => {
    const init = () => {
        const form = document.getElementById('photoContactForm');
        const out = document.getElementById('photoFormResponse');
        if (!form || !out) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            out.innerHTML = '';
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
            try {
                const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                out.innerHTML = '<div class="inline-alert info" role="status"><i class="fas fa-check-circle" aria-hidden="true"></i> Thanks! Your message was sent. Ermias usually replies within 1–2 days.</div>';
                form.reset();
            } catch {
                const mail = ARC.util.escapeHtml(ARC.config.CONTACT_EMAIL);
                out.innerHTML = `<div class="inline-alert error" role="alert"><i class="fas fa-exclamation-circle" aria-hidden="true"></i> Sorry, the message couldn't be sent. Please try again or email <a href="mailto:${mail}">${mail}</a>.</div>`;
            } finally {
                btn.disabled = false;
                btn.innerHTML = original;
            }
        });
    };

    /** Used by the chat assistant to pre-fill an inquiry. */
    const prefill = ({ type, subject } = {}) => {
        const form = document.getElementById('photoContactForm');
        if (!form) return;
        if (type && form.inquiry_type) form.inquiry_type.value = type;
        if (subject && form.subject && !form.subject.value) form.subject.value = subject;
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => form.name?.focus({ preventScroll: true }), 600);
    };

    return { init, prefill };
})();

/* ---------- Light image protection (deterrent only; originals are public files) ---------- */
ARC.protect = () => {
    let last = 0;
    const isPhoto = (t) => t instanceof Element && (t.closest('.gallery-item') || t.closest('.lightbox-stage'));
    const warn = () => {
        if (Date.now() - last < 2500) return;
        last = Date.now();
        ARC.toast('Photos are © ARC-NATURE PHOTOGRAPHY. Use the Download button for a licensed copy.', { icon: 'fa-copyright' });
    };
    document.addEventListener('contextmenu', (e) => { if (isPhoto(e.target)) { e.preventDefault(); warn(); } });
    document.addEventListener('dragstart', (e) => { if (isPhoto(e.target)) e.preventDefault(); });
};
