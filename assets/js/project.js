/* Minimal behaviour for project sub-pages: theme toggle, mobile menu, footer year. */
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const store = (k, v) => { try { v === undefined ? null : localStorage.setItem(k, v); return localStorage.getItem(k); } catch { return null; } };
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        store('theme', next);
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
});
