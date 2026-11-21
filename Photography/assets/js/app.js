/* ARC-NATURE PHOTOGRAPHY — bootstrap. Wires the modules together once the DOM is ready. */
'use strict';

(() => {
    // Adapter so the chat engine can answer questions about the live portfolio data.
    ARC.portfolio = {
        categories: CATEGORY_INFO,
        counts: () => ARC.gallery.counts(),
        search: (q, limit) => ARC.gallery.searchPhotos(q, limit),
        topLocations(n = 10) {
            const m = new Map();
            ARC.gallery.all().forEach((p) => m.set(p.location, (m.get(p.location) || 0) + 1));
            return [...m].sort((a, b) => b[1] - a[1]).slice(0, n);
        },
        locationCount: () => new Set(ARC.gallery.all().map((p) => p.location)).size
    };

    function downloadStatusUI() {
        const badge = document.getElementById('downloadStatus');
        const buy = document.getElementById('purchaseUnlimitedBtn');
        buy?.addEventListener('click', () => ARC.downloads.openPurchase({ reason: 'general' }));
        ARC.downloads.onChange((s) => {
            if (buy) buy.hidden = s.unlimited;
            if (!badge) return;
            badge.classList.remove('warn', 'empty', 'premium');
            if (s.unlimited) {
                badge.hidden = false;
                badge.classList.add('premium');
                badge.innerHTML = '<i class="fas fa-crown" aria-hidden="true"></i><span>Unlimited downloads</span>';
            } else if (s.remaining < s.free) {
                badge.hidden = false;
                if (s.remaining <= 0) badge.classList.add('empty');
                else if (s.remaining === 1) badge.classList.add('warn');
                badge.innerHTML = `<i class="fas fa-download" aria-hidden="true"></i><span>${Math.max(0, s.remaining)}/${s.free} free downloads left</span>`;
            } else {
                badge.hidden = true;
            }
        });
    }

    function start() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        ARC.theme.init();
        ARC.nav.init();
        ARC.downloads.init();
        ARC.gallery.init();
        ARC.contact.init();
        ARC.chat.init();
        document.querySelectorAll('[data-open-chat]').forEach((b) => b.addEventListener('click', () => ARC.chat.open()));
        downloadStatusUI();
        ARC.backToTop();
        ARC.reveal();
        ARC.protect();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
