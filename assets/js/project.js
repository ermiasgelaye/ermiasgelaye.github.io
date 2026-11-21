/* Shared behaviour for project pages: theme toggle, mobile menu, footer year,
 * plus the small ARC.* helpers the shared chat assistant needs (when a page includes it). */
'use strict';

window.ARC = window.ARC || {};
ARC.config = ARC.config || {};

ARC.util = ARC.util || (() => {
    const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const store = {
        get(k, f = null) { try { const v = localStorage.getItem(k); return v === null ? f : v; } catch { return f; } },
        set(k, v) { try { localStorage.setItem(k, String(v)); } catch { /* blocked */ } },
        remove(k) { try { localStorage.removeItem(k); } catch { /* blocked */ } },
        getJSON(k, f = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
        setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* blocked */ } }
    };
    return { escapeHtml: (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]), store };
})();

ARC.toast = ARC.toast || ((message, { type = 'info' } = {}) => {
    let stack = document.querySelector('.toast-stack');
    if (!stack) { stack = Object.assign(document.createElement('div'), { className: 'toast-stack' }); stack.setAttribute('role', 'status'); document.body.appendChild(stack); }
    const el = document.createElement('div');
    el.className = `toast-x ${type}`;
    el.innerHTML = '<span class="toast-icon"><i class="fas fa-circle-info" aria-hidden="true"></i></span><div></div>';
    el.lastElementChild.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3500);
});

/** Theme-aware colours for charts (read from CSS custom properties). */
ARC.themeColors = () => {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    return { brand: v('--brand'), accent: v('--accent'), ink: v('--ink'), ink2: v('--ink-2'), ink3: v('--ink-3'), border: v('--border'), surface: v('--surface-2') };
};

/** Load Chart.js once, on demand. */
ARC.loadChartJs = (() => {
    let p = null;
    return () => p || (p = new Promise((resolve, reject) => {
        if (window.Chart) return resolve(window.Chart);
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
        s.crossOrigin = 'anonymous';
        s.onload = () => resolve(window.Chart);
        s.onerror = () => { p = null; reject(new Error('Chart.js failed to load')); };
        document.head.appendChild(s);
    }));
})();

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        ARC.util.store.set('theme', next);
        document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    });

    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        const setOpen = (open) => {
            links.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.innerHTML = `<i class="fas ${open ? 'fa-times' : 'fa-bars'}" aria-hidden="true"></i>`;
        };
        toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!links.classList.contains('open')); });
        document.addEventListener('click', (e) => { if (links.classList.contains('open') && !links.contains(e.target)) setOpen(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    }

    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Scroll reveal (if the page uses it)
    const els = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
        els.forEach((e) => io.observe(e));
    } else els.forEach((e) => e.classList.add('in'));

    // Project assistant (shared chat), if present on this page
    if (ARC.chat && document.getElementById('chatPanel')) {
        ARC.chat.init();
        document.querySelectorAll('[data-open-chat]').forEach((b) => b.addEventListener('click', () => ARC.chat.open()));
    }
});
