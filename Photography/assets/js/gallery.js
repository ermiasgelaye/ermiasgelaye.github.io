/* ARC-NATURE PHOTOGRAPHY — gallery grid, filtering, search, favourites, lightbox.
 * Data: PHOTOS and CATEGORY_INFO from data/photos.js.
 * Grid uses 480/800px thumbnails (WebP with JPEG fallback); the lightbox shows the 800px thumbnail
 * instantly and swaps in the original only on large screens or when zooming. */
'use strict';

ARC.gallery = (() => {
    const { escapeHtml, store, debounce } = ARC.util;
    const PAGE = 24;
    const MAX_AUTO_LOADS = 3;
    const PHOTOG = ARC.config.PHOTOGRAPHER;

    const ALIASES = typeof PHOTO_ALIASES === 'object' ? PHOTO_ALIASES : {};
    const thumbPath = (src, dir, ext) => src.replace(/^images\/([^/]+)\/(.+)\.[^.]+$/, `images/${dir}/$1/$2.${ext}`);
    const photos = PHOTOS.map((p, i) => {
        const cats = [p.category, ...(p.also || [])];
        return {
            ...p,
            id: i,
            cats,
            photographer: p.photographer || PHOTOG,
            thumb: thumbPath(p.src, 'thumbs', 'jpg'),
            thumbSm: thumbPath(p.src, 'thumbs-sm', 'jpg'),
            thumbWebp: thumbPath(p.src, 'thumbs', 'webp'),
            thumbSmWebp: thumbPath(p.src, 'thumbs-sm', 'webp'),
            haystack: [p.title, p.location, p.region, p.country, p.date, p.data, ...cats.map((c) => `${c} ${CATEGORY_INFO[c]?.name || ''}`), ...(p.tags || [])]
                .filter(Boolean).join(' ').toLowerCase()
        };
    });
    const bySrc = new Map(photos.map((p) => [p.src, p]));
    const resolveSrc = (src) => (bySrc.has(src) ? src : ALIASES[src] || src);
    const fmtDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(+y, +m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); };

    const state = {
        category: 'all',
        query: '',
        sort: 'default',
        place: null, // { name, locations: Set } when filtering from the travel map
        where: '', // 'country:Canada' | 'region:Ontario' from the place filter
        favorites: new Set((store.getJSON('photoFavorites', null) || store.getJSON('photoGalleryState', {})?.favorites || []).map(resolveSrc)),
        list: [],
        shown: 0,
        lbIndex: -1
    };

    let el = {};
    let shuffleOrder = null;

    /* ---------- Filtering ---------- */
    const tokens = (q) => q.toLowerCase().split(/[\s,]+/).filter(Boolean);

    function compute() {
        const words = tokens(state.query);
        let list = photos.filter((p) => {
            if (state.category === 'favorites') { if (!state.favorites.has(p.src)) return false; }
            else if (state.category !== 'all' && !p.cats.includes(state.category)) return false;
            if (state.place && !state.place.locations.has(p.location)) return false;
            if (state.where) {
                const [kind, val] = state.where.split(':');
                if ((kind === 'country' ? p.country : p.region) !== val) return false;
            }
            return words.every((w) => p.haystack.includes(w));
        });
        switch (state.sort) {
            case 'title': list = [...list].sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'location': list = [...list].sort((a, b) => a.location.localeCompare(b.location) || a.title.localeCompare(b.title)); break;
            case 'newest': list = [...list].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id - a.id); break;
            case 'random':
                if (!shuffleOrder) { shuffleOrder = photos.map((p) => p.id); for (let i = shuffleOrder.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffleOrder[i], shuffleOrder[j]] = [shuffleOrder[j], shuffleOrder[i]]; } }
                { const rank = new Map(shuffleOrder.map((id, i) => [id, i])); list = [...list].sort((a, b) => rank.get(a.id) - rank.get(b.id)); }
                break;
            default: break;
        }
        state.list = list;
    }

    /* ---------- Rendering ---------- */
    function card(p, eager = false) {
        const cat = CATEGORY_INFO[p.category] || { name: p.category, icon: 'image' };
        const fav = state.favorites.has(p.src);
        const item = document.createElement('article');
        item.className = 'gallery-item';
        item.dataset.src = p.src;
        item.innerHTML = `
            <picture>
                <source type="image/webp" srcset="${escapeHtml(p.thumbSmWebp)} 480w, ${escapeHtml(p.thumbWebp)} 800w"
                        sizes="(max-width: 575.98px) 50vw, (max-width: 991.98px) 45vw, 300px">
                <img class="thumb" src="${escapeHtml(p.thumb)}" alt="${escapeHtml(p.title)}: ${escapeHtml(p.location)}"
                     srcset="${escapeHtml(p.thumbSm)} 480w, ${escapeHtml(p.thumb)} 800w"
                     sizes="(max-width: 575.98px) 50vw, (max-width: 991.98px) 45vw, 300px"
                     loading="${eager ? 'eager' : 'lazy'}" fetchpriority="${eager ? 'high' : 'low'}" decoding="async" width="800" height="600" draggable="false">
            </picture>
            <button type="button" class="gallery-open" aria-label="Open ${escapeHtml(p.title)}"></button>
            <div class="gallery-caption">
                <h3>${escapeHtml(p.title)}</h3>
                <p><i class="fas fa-location-dot" aria-hidden="true"></i> ${escapeHtml(p.location)} · <i class="fas fa-${cat.icon}" aria-hidden="true"></i> ${escapeHtml(cat.name)}</p>
            </div>
            <div class="item-actions">
                <button type="button" data-action="favorite" aria-pressed="${fav}" aria-label="${fav ? 'Remove from' : 'Add to'} favourites" title="Favourite"><i class="fas fa-heart" aria-hidden="true"></i></button>
                <button type="button" data-action="share" aria-label="Share ${escapeHtml(p.title)}" title="Share"><i class="fas fa-share-nodes" aria-hidden="true"></i></button>
            </div>`;
        const img = item.querySelector('img');
        img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        img.addEventListener('error', function onErr() {
            if (img.dataset.fallback !== '1') { img.dataset.fallback = '1'; img.parentElement.querySelector('source')?.remove(); img.removeAttribute('srcset'); img.src = p.src; return; } // thumb missing → original
            img.removeEventListener('error', onErr);
            const pic = img.closest('picture') || img;
            pic.insertAdjacentHTML('afterend', `<div class="image-fallback" aria-hidden="true"><i class="fas fa-${cat.icon}"></i></div>`);
            pic.remove();
        });
        return item;
    }

    function render({ reset = true } = {}) {
        if (reset) {
            compute();
            state.shown = 0;
            state.autoLoads = 0;
            el.grid.innerHTML = '';
            el.grid.setAttribute('aria-busy', 'true');
        }
        if (!state.list.length) {
            el.grid.innerHTML = `<div class="empty-state">
                <i class="fas ${state.category === 'favorites' ? 'fa-heart' : 'fa-image'}" aria-hidden="true"></i>
                <h3>${state.category === 'favorites' ? 'No favourites yet' : 'No photos found'}</h3>
                <p>${state.category === 'favorites' ? 'Tap the heart on any photo to save it here.' : 'Try another category or search term.'}</p>
                ${state.query || state.category !== 'all' || state.place || state.where ? '<button type="button" class="btn-outline" data-reset><i class="fas fa-rotate-left" aria-hidden="true"></i> Show all photos</button>' : ''}
            </div>`;
            el.grid.querySelector('[data-reset]')?.addEventListener('click', () => set({ category: 'all', query: '', where: '' }));
        } else {
            const frag = document.createDocumentFragment();
            const next = state.list.slice(state.shown, state.shown + PAGE);
            next.forEach((p, k) => frag.appendChild(card(p, state.shown === 0 && k < 6)));
            el.grid.appendChild(frag);
            state.shown += next.length;
        }
        el.grid.setAttribute('aria-busy', 'false');
        el.more.hidden = state.shown >= state.list.length;
        el.more.querySelector('.remaining').textContent = Math.max(0, state.list.length - state.shown);
        updateStatus();
    }

    function updateStatus() {
        const label = state.category === 'all' ? 'all categories' : state.category === 'favorites' ? 'your favourites' : CATEGORY_INFO[state.category]?.name || state.category;
        const whereLabel = state.where ? state.where.split(':')[1] : '';
        el.status.innerHTML = `<span>Showing <strong>${state.shown}</strong> of <strong>${state.list.length}</strong> photos ${state.place ? `taken at <strong>${escapeHtml(state.place.name)}</strong>` : `in ${escapeHtml(label)}`}${whereLabel ? ` from <strong>${escapeHtml(whereLabel)}</strong>` : ''}${state.query ? ` matching “${escapeHtml(state.query)}”` : ''}</span>${state.place ? '<button type="button" class="btn-outline btn-sm-pill" data-clear-place><i class="fas fa-times" aria-hidden="true"></i> Clear place</button>' : ''}`;
        el.status.querySelector('[data-clear-place]')?.addEventListener('click', () => set({ place: null }));
        el.chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.category === state.category)));
        const favCount = state.favorites.size;
        el.favChipCount && (el.favChipCount.textContent = favCount);
        if (el.favFab) {
            el.favFab.hidden = favCount === 0;
            el.favFab.querySelector('.dock-badge').textContent = favCount;
        }
        el.clear.hidden = !state.query;
    }

    function syncURL() {
        const p = new URLSearchParams(location.search);
        state.category !== 'all' ? p.set('category', state.category) : p.delete('category');
        state.query ? p.set('q', state.query) : p.delete('q');
        state.where ? p.set('where', state.where) : p.delete('where');
        const qs = p.toString();
        history.replaceState(history.state, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
    }

    /** Public: change filters. */
    function set({ category, query, sort, place, where, scroll = false } = {}) {
        // A place filter stays only while explicitly passed; changing category/search clears it.
        if (place !== undefined) state.place = place ? { name: place.name, locations: new Set(place.locations) } : null;
        else if (category !== undefined || query !== undefined) state.place = null;
        if (category !== undefined) state.category = (category === 'favorites' || category === 'all' || CATEGORY_INFO[category]) ? category : 'all';
        if (query !== undefined) { state.query = String(query).trim(); el.search.value = state.query; }
        if (sort !== undefined) { state.sort = sort; el.sort.value = sort; }
        if (where !== undefined) { state.where = where; if (el.where) el.where.value = where; }
        render();
        syncURL();
        if (scroll) document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    }

    /* ---------- Favourites ---------- */
    function toggleFavorite(src) {
        const on = !state.favorites.has(src);
        on ? state.favorites.add(src) : state.favorites.delete(src);
        store.setJSON('photoFavorites', [...state.favorites]);
        document.querySelectorAll(`.gallery-item[data-src="${CSS.escape(src)}"] [data-action="favorite"]`).forEach((b) => {
            b.setAttribute('aria-pressed', String(on));
            b.setAttribute('aria-label', `${on ? 'Remove from' : 'Add to'} favourites`);
        });
        if (state.category === 'favorites' && !on) render(); else updateStatus();
        if (state.lbIndex >= 0) updateLightboxFav();
        return on;
    }

    /* ---------- Share ---------- */
    async function share(p) {
        const url = new URL(location.href);
        url.search = '';
        url.hash = '';
        url.searchParams.set('photo', p.src.split('/').pop());
        const data = { title: p.title, text: `${p.title}, photo by ${p.photographer}`, url: url.toString() };
        try {
            if (navigator.share) { await navigator.share(data); return; }
            await navigator.clipboard.writeText(data.url);
            ARC.toast('Link copied to clipboard.', { type: 'success', icon: 'fa-link' });
        } catch (err) {
            if (err?.name !== 'AbortError') window.prompt('Copy this link:', data.url);
        }
    }

    /* ---------- Lightbox ---------- */
    let lbReturnFocus = null;
    let touchX = null;

    function openLightbox(index) {
        if (index < 0 || index >= state.list.length) return;
        if (state.lbIndex < 0) lbReturnFocus = document.activeElement;
        state.lbIndex = index;
        const p = state.list[index];
        const lb = el.lb;
        const img = lb.querySelector('.lb-img');
        el.stage.classList.remove('zoomed');
        img.alt = `${p.title}: ${p.location}`;
        delete img.dataset.full;
        img.src = p.thumb; // instant preview (800px — already sharp on phones)
        if (needsFull()) loadFull(p);

        const cat = CATEGORY_INFO[p.category] || { name: p.category, icon: 'image' };
        lb.querySelector('.lb-title').textContent = p.title;
        lb.querySelector('.lb-meta').innerHTML = `
            <li><i class="fas fa-location-dot" aria-hidden="true"></i><span>${escapeHtml(p.location)}</span></li>
            <li><i class="fas fa-${cat.icon}" aria-hidden="true"></i><span>${escapeHtml(cat.name)}</span></li>
            ${p.date ? `<li><i class="fas fa-calendar" aria-hidden="true"></i><span>${escapeHtml(fmtDate(p.date))}</span></li>` : ''}
            <li><i class="fas fa-camera" aria-hidden="true"></i><span>${escapeHtml(p.photographer)}</span></li>
            ${p.data ? `<li><i class="fas fa-database" aria-hidden="true"></i><span>${escapeHtml(p.data)}</span></li>` : ''}`;
        lb.querySelector('.lb-tags').innerHTML = (p.tags || []).map((t) => `<button type="button" class="tag" data-tag="${escapeHtml(t)}">#${escapeHtml(t)}</button>`).join('');
        lb.querySelector('.lb-counter').textContent = `${index + 1} / ${state.list.length}`;
        lb.querySelector('.wm').textContent = `© ${p.photographer}`;
        updateLightboxFav();
        updateLightboxPremium();

        // Preload neighbours' thumbnails
        [index - 1, index + 1].forEach((i) => { const n = state.list[i]; if (n) { const im = new Image(); im.src = n.thumb; } });

        if (lb.hidden) {
            lb.hidden = false;
            document.body.classList.add('modal-open-lock');
            lb.querySelector('.lb-close').focus();
        }
        const u = new URL(location.href);
        u.searchParams.set('photo', p.src.split('/').pop());
        history.replaceState(history.state, '', u);
    }

    // Phones (≲1000 device pixels wide) see no difference between the 800px thumbnail and a
    // multi-megabyte original, so originals load only on larger screens or when zooming.
    const needsFull = () => window.innerWidth * (window.devicePixelRatio || 1) > 1000;
    function loadFull(p) {
        const img = el.lb.querySelector('.lb-img');
        if (img.dataset.full === p.src) return;
        img.classList.add('is-loading');
        const full = new Image();
        full.onload = () => {
            if (state.list[state.lbIndex] !== p) return;
            img.src = p.src; img.dataset.full = p.src; img.classList.remove('is-loading');
        };
        full.onerror = () => img.classList.remove('is-loading');
        full.src = p.src;
    }
    function toggleZoom(clientX, clientY) {
        const p = state.list[state.lbIndex];
        if (!p) return;
        const st = el.stage;
        const on = !st.classList.contains('zoomed');
        stopSlideshow();
        st.classList.toggle('zoomed', on);
        if (on) {
            loadFull(p);
            // centre the zoom on the tapped point
            requestAnimationFrame(() => {
                const img = st.querySelector('.lb-img');
                const r = st.getBoundingClientRect();
                const fx = clientX ? (clientX - r.left) / r.width : 0.5, fy = clientY ? (clientY - r.top) / r.height : 0.5;
                st.scrollLeft = Math.max(0, img.scrollWidth * fx - r.width / 2);
                st.scrollTop = Math.max(0, img.scrollHeight * fy - r.height / 2);
            });
        }
        el.lb.querySelector('[data-lb="zoom"]')?.setAttribute('aria-pressed', String(on));
    }

    let slideTimer = null;
    function setPlayButton(on) {
        const b = el.lb.querySelector('[data-lb="play"]');
        if (!b) return;
        b.setAttribute('aria-pressed', String(on));
        b.innerHTML = on ? '<i class="fas fa-pause" aria-hidden="true"></i> Pause slideshow' : '<i class="fas fa-play" aria-hidden="true"></i> Slideshow';
    }
    function startSlideshow() {
        stopSlideshow();
        el.stage.classList.remove('zoomed');
        slideTimer = setInterval(() => step(1, true), 4500);
        setPlayButton(true);
    }
    function stopSlideshow() {
        if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
        setPlayButton(false);
    }

    function closeLightbox() {
        if (el.lb.hidden) return;
        stopSlideshow();
        el.lb.hidden = true;
        state.lbIndex = -1;
        if (!document.querySelector('.modal-backdrop-x')) document.body.classList.remove('modal-open-lock');
        const u = new URL(location.href);
        u.searchParams.delete('photo');
        history.replaceState(history.state, '', u);
        lbReturnFocus?.focus?.();
    }

    const step = (d, fromSlideshow = false) => {
        if (state.lbIndex < 0 || !state.list.length) return;
        if (!fromSlideshow) stopSlideshow();
        const n = (state.lbIndex + d + state.list.length) % state.list.length;
        // make sure the grid contains the photo we navigate to
        while (n >= state.shown && state.shown < state.list.length) render({ reset: false });
        openLightbox(n);
    };

    function updateLightboxFav() {
        const p = state.list[state.lbIndex];
        if (!p) return;
        const b = el.lb.querySelector('[data-lb="favorite"]');
        const on = state.favorites.has(p.src);
        b.setAttribute('aria-pressed', String(on));
        b.innerHTML = `<i class="${on ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i> ${on ? 'Saved to favourites' : 'Add to favourites'}`;
    }
    function updateLightboxPremium() {
        const s = ARC.downloads.getStatus();
        el.lb.querySelector('[data-lb="purchase"]').hidden = s.unlimited;
        el.lb.querySelector('[data-lb="download"]').innerHTML = s.unlimited
            ? '<i class="fas fa-download" aria-hidden="true"></i> Download full resolution'
            : `<i class="fas fa-download" aria-hidden="true"></i> Free download (${s.remaining}/${s.free} left)`;
    }

    function bindLightbox() {
        const lb = el.lb;
        lb.addEventListener('click', (e) => {
            if (e.target === lb) return closeLightbox();
            const act = e.target.closest('[data-lb]')?.dataset.lb;
            const p = state.list[state.lbIndex];
            const tag = e.target.closest('[data-tag]')?.dataset.tag;
            if (tag) { closeLightbox(); set({ category: 'all', query: tag, scroll: true }); return; }
            if (!act || !p) return;
            if (act === 'close') closeLightbox();
            if (act === 'prev') step(-1);
            if (act === 'next') step(1);
            if (act === 'favorite') toggleFavorite(p.src);
            if (act === 'share') share(p);
            if (act === 'download') ARC.downloads.download(p);
            if (act === 'purchase') { stopSlideshow(); ARC.downloads.openPurchase({ reason: 'early', photo: p }); }
            if (act === 'play') (slideTimer ? stopSlideshow() : startSlideshow());
            if (act === 'zoom') toggleZoom();
        });
        document.addEventListener('keydown', (e) => {
            if (lb.hidden || document.querySelector('.modal-backdrop-x')) return;
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') step(-1);
            else if (e.key === 'ArrowRight') step(1);
            else if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); slideTimer ? stopSlideshow() : startSlideshow(); }
            else if (e.key === 'Tab') {
                const f = [...lb.querySelectorAll('button:not([hidden]), a[href]')].filter((n) => n.offsetParent !== null);
                if (!f.length) return;
                if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
                else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
            }
        });
        const stage = el.stage;
        let touchY = null, lastTap = 0;
        stage.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) { touchX = null; return; }
            touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
        }, { passive: true });
        stage.addEventListener('touchend', (e) => {
            if (touchX === null || e.target.closest('button')) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touchX, dy = t.clientY - touchY;
            touchX = null;
            // double-tap → zoom
            if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                const now = Date.now();
                if (now - lastTap < 300) { e.preventDefault(); toggleZoom(t.clientX, t.clientY); lastTap = 0; } else lastTap = now;
                return;
            }
            if (stage.classList.contains('zoomed')) return; // panning a zoomed photo
            if (dy > 90 && Math.abs(dx) < 70) closeLightbox();          // swipe down to close
            else if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
        });
        stage.querySelector('.lb-img').addEventListener('dblclick', (e) => toggleZoom(e.clientX, e.clientY));
    }

    /* ---------- Photo of the day (same photo for everyone on a given date) ---------- */
    function photoOfTheDay() {
        const box = document.getElementById('photoOfDay');
        if (!box) return;
        const d = new Date();
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        let h = 2166136261;
        for (const c of key) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
        const p = photos[Math.abs(h) % photos.length];
        box.innerHTML = `<img src="${escapeHtml(p.thumb)}" alt="" width="96" height="72" loading="lazy" decoding="async">
            <span><small><i class="fas fa-star" aria-hidden="true"></i> Photo of the day</small><strong>${escapeHtml(p.title)}</strong><em>${escapeHtml(p.location)}</em></span>
            <i class="fas fa-chevron-right" aria-hidden="true"></i>`;
        box.setAttribute('aria-label', `Photo of the day: ${p.title}, ${p.location}`);
        box.hidden = false;
        box.addEventListener('click', () => ARC.gallery.openBySrc(p.src));
    }

    /* ---------- Init ---------- */
    function counts() {
        const c = { all: photos.length };
        photos.forEach((p) => p.cats.forEach((k) => { c[k] = (c[k] || 0) + 1; }));
        return c;
    }

    /** Category chips are generated from CATEGORY_INFO (inserted before the Favourites chip). */
    function buildChips() {
        const box = document.getElementById('categories');
        const fav = box?.querySelector('[data-category="favorites"]');
        if (!box || !fav) return;
        box.querySelectorAll('.chip[data-category]:not([data-category="all"]):not([data-category="favorites"])').forEach((c) => c.remove());
        Object.entries(CATEGORY_INFO).forEach(([key, info]) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'chip'; b.dataset.category = key; b.title = info.description || '';
            b.setAttribute('aria-pressed', 'false');
            b.innerHTML = `<i class="fas fa-${info.icon}" aria-hidden="true"></i> ${escapeHtml(info.name)} <span class="count"></span>`;
            box.insertBefore(b, fav);
        });
    }

    /** Country → region filter, with counts. */
    function buildWhere() {
        const sel = document.getElementById('placeFilter');
        if (!sel) return null;
        const byCountry = new Map();
        photos.forEach((p) => {
            const c = p.country || 'Other';
            if (!byCountry.has(c)) byCountry.set(c, { n: 0, regions: new Map() });
            const e = byCountry.get(c); e.n += 1;
            if (p.region) e.regions.set(p.region, (e.regions.get(p.region) || 0) + 1);
        });
        const opts = ['<option value="">All places</option>'];
        [...byCountry.entries()].sort((a, b) => b[1].n - a[1].n).forEach(([c, e]) => {
            if (c === 'Other') return;
            opts.push(`<optgroup label="${escapeHtml(c)}"><option value="country:${escapeHtml(c)}">All of ${escapeHtml(c)} (${e.n})</option>` +
                [...e.regions.entries()].sort((a, b) => b[1] - a[1]).map(([r, n]) => `<option value="region:${escapeHtml(r)}">${escapeHtml(r)} (${n})</option>`).join('') + '</optgroup>');
        });
        sel.innerHTML = opts.join('');
        return sel;
    }

    function init() {
        buildChips();
        el = {
            grid: document.getElementById('photoGallery'),
            more: document.getElementById('loadMore'),
            status: document.getElementById('galleryStatus'),
            search: document.getElementById('photoSearch'),
            clear: document.getElementById('searchClear'),
            sort: document.getElementById('sortSelect'),
            chips: [...document.querySelectorAll('.chip[data-category]')],
            favChipCount: document.querySelector('.chip[data-category="favorites"] .count'),
            favFab: document.getElementById('favoriteCounter'),
            lb: document.getElementById('lightbox'),
            stage: document.querySelector('#lightbox .lightbox-stage'),
            where: buildWhere()
        };
        if (!el.grid) return;

        // Live counts from the data (no more hard-coded numbers)
        const c = counts();
        el.chips.forEach((chip) => { const n = chip.querySelector('.count'); if (n && c[chip.dataset.category] !== undefined) n.textContent = c[chip.dataset.category]; });
        document.querySelectorAll('[data-stat="photos"]').forEach((n) => { n.textContent = photos.length.toLocaleString(); });
        document.querySelectorAll('[data-stat="categories"]').forEach((n) => { n.textContent = Object.keys(CATEGORY_INFO).length; });
        document.querySelectorAll('[data-stat="locations"]').forEach((n) => { n.textContent = new Set(photos.map((p) => p.location)).size; });

        // Restore from URL (shareable filters) or last session
        const qp = new URLSearchParams(location.search);
        state.category = qp.get('category') || 'all';
        if (state.category !== 'all' && state.category !== 'favorites' && !CATEGORY_INFO[state.category]) state.category = 'all';
        state.query = qp.get('q') || '';
        state.where = qp.get('where') || '';
        if (el.where) {
            el.where.value = state.where;
            if (el.where.value !== state.where) state.where = '';
            el.where.addEventListener('change', () => set({ where: el.where.value }));
        }
        state.sort = store.get('photoSort', 'default');
        el.search.value = state.query;
        el.sort.value = state.sort;

        el.chips.forEach((chip) => chip.addEventListener('click', () => set({ category: chip.dataset.category })));
        el.more.addEventListener('click', () => render({ reset: false }));
        // Keep loading as the visitor scrolls — but only a few batches per filter, then the
        // button takes over, so the sections below the gallery (map, about, contact) stay reachable.
        // Only when the visitor *pauses* at the end of the grid (button visible ~0.7 s): scrolling
        // or jumping past it (e.g. the "Map" link) must not shift the page under them.
        if ('IntersectionObserver' in window) {
            let dwell = null;
            new IntersectionObserver((entries) => {
                const visible = entries.some((en) => en.isIntersecting);
                clearTimeout(dwell);
                if (!visible || el.more.hidden || state.autoLoads >= MAX_AUTO_LOADS) return;
                dwell = setTimeout(() => {
                    const r = el.more.getBoundingClientRect();
                    if (el.more.hidden || r.top > innerHeight || r.bottom < 0) return;
                    state.autoLoads += 1;
                    render({ reset: false });
                }, 700);
            }, { threshold: 0.5 }).observe(el.more);
        }
        document.getElementById('surpriseBtn')?.addEventListener('click', () => {
            if (!state.list.length) return;
            const idx = Math.floor(Math.random() * state.list.length);
            while (idx >= state.shown) render({ reset: false });
            openLightbox(idx);
        });
        photoOfTheDay();
        el.search.addEventListener('input', debounce(() => set({ query: el.search.value }), 220));
        el.search.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el.search.value) { e.stopPropagation(); set({ query: '' }); } });
        el.clear.addEventListener('click', () => { set({ query: '' }); el.search.focus(); });
        el.sort.addEventListener('change', () => { store.set('photoSort', el.sort.value); set({ sort: el.sort.value }); });
        el.favFab?.addEventListener('click', () => set({ category: 'favorites', scroll: true }));

        el.grid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;
            const p = bySrc.get(item.dataset.src);
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (action === 'favorite') { toggleFavorite(p.src); return; }
            if (action === 'share') { share(p); return; }
            if (e.target.closest('.gallery-open')) openLightbox(state.list.indexOf(p));
        });

        // "/" focuses search (doesn't hijack the browser's Ctrl/Cmd+F)
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !e.target.closest('input, textarea, select, [contenteditable]')) { e.preventDefault(); el.search.focus(); }
        });

        bindLightbox();
        ARC.downloads.onChange(() => { if (state.lbIndex >= 0) updateLightboxPremium(); });
        render();

        // Deep link: ?photo=water212.jpeg
        const deep = qp.get('photo');
        if (deep) {
            const target = resolveSrc(Object.keys(ALIASES).find((s) => s.endsWith(`/${deep}`)) || '');
            const idx = state.list.findIndex((p) => p.src.endsWith(`/${deep}`) || p.src === target);
            if (idx >= 0) {
                while (idx >= state.shown) render({ reset: false });
                openLightbox(idx);
            }
        }
    }

    /* ---------- API for the chat assistant ---------- */
    const searchPhotos = (q, limit = 6) => {
        const words = tokens(q);
        if (!words.length) return [];
        return photos.filter((p) => words.every((w) => p.haystack.includes(w))).slice(0, limit);
    };

    return {
        init, set, searchPhotos,
        /** Filter the grid to one travel-map place and scroll to it. */
        showPlace: (place) => set({ category: 'all', query: '', place, scroll: true }),
        all: () => photos,
        counts,
        openBySrc: (src) => {
            src = resolveSrc(src);
            set({ category: 'all', query: '', where: '' });
            const idx = state.list.findIndex((p) => p.src === src);
            if (idx >= 0) { while (idx >= state.shown) render({ reset: false }); openLightbox(idx); }
        },
        favoritesCount: () => state.favorites.size
    };
})();
