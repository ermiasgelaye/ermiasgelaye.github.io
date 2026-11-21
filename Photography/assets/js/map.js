/* ARC-NATURE PHOTOGRAPHY — "Where I've travelled" map.
 * Uses Leaflet + OpenStreetMap tiles, loaded only when the map scrolls near the viewport.
 * Data: PLACES (data/places.js) joined with the gallery's photos by exact location string. */
'use strict';

ARC.travelMap = (() => {
    const { escapeHtml, loadScript } = ARC.util;
    const LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    const LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    const VIEWS = {
        canada: [[41.5, -128], [55, -59]],
        europe: [[24, 9], [47.5, 57]]
    };

    let map = null;
    let places = [];

    /** Join PLACES with photos → [{ ...place, photos: [...] }] (only places that have photos). */
    function buildPlaces() {
        const byLoc = new Map();
        ARC.gallery.all().forEach((p) => {
            if (!byLoc.has(p.location)) byLoc.set(p.location, []);
            byLoc.get(p.location).push(p);
        });
        return PLACES.map((pl) => ({ ...pl, photos: pl.match.flatMap((m) => byLoc.get(m) || []) }))
            .filter((pl) => pl.photos.length)
            .sort((a, b) => b.photos.length - a.photos.length);
    }

    function stats() {
        const el = document.getElementById('mapStats');
        if (!el) return;
        const specific = places.filter((p) => p.precision !== 'area');
        const countries = new Set(places.map((p) => p.country));
        const regions = new Set(places.filter((p) => p.country === 'Canada').map((p) => p.region));
        const mapped = places.reduce((n, p) => n + p.photos.length, 0);
        el.innerHTML = `
            <div><strong>${specific.length}</strong><span>specific places</span></div>
            <div><strong>${regions.size}</strong><span>Canadian provinces</span></div>
            <div><strong>${countries.size}</strong><span>countries</span></div>
            <div><strong>${mapped.toLocaleString()}</strong><span>photos mapped</span></div>`;
    }

    /** Accessible list of places (works without the map, and on small screens). */
    function placeList() {
        const list = document.getElementById('placeList');
        if (!list) return;
        list.innerHTML = places.map((p, i) =>
            `<button type="button" class="chip" data-place="${i}" title="${escapeHtml(p.region)}, ${escapeHtml(p.country)}">
                <i class="fas ${p.precision === 'area' ? 'fa-draw-polygon' : 'fa-location-dot'}" aria-hidden="true"></i>
                ${escapeHtml(p.name)} <span class="count">${p.photos.length}</span></button>`).join('');
        list.addEventListener('click', (e) => {
            const b = e.target.closest('[data-place]');
            if (b) ARC.gallery.showPlace({ name: places[+b.dataset.place].name, locations: places[+b.dataset.place].match });
        });
    }

    const radius = (n) => Math.min(26, 6 + Math.sqrt(n) * 1.7);

    function popupFor(pl) {
        const box = document.createElement('div');
        box.className = 'map-popup';
        const sample = pl.photos.slice(0, 3);
        box.innerHTML = `
            <h3>${escapeHtml(pl.name)}</h3>
            <p class="map-popup-meta">${escapeHtml(pl.region === pl.country ? pl.country : `${pl.region}, ${pl.country}`)} · <strong>${pl.photos.length}</strong> photo${pl.photos.length === 1 ? '' : 's'}</p>
            ${pl.precision === 'area' ? '<p class="map-popup-note"><i class="fas fa-circle-info" aria-hidden="true"></i> General area — these photos are labelled with the region only.</p>' : ''}
            <div class="map-popup-thumbs">${sample.map((p) => `<button type="button" data-open="${escapeHtml(p.src)}" title="${escapeHtml(p.title)}"><img src="${escapeHtml(p.thumb)}" alt="${escapeHtml(p.title)}" loading="lazy" width="80" height="60"></button>`).join('')}</div>
            <button type="button" class="btn-brand btn-sm-pill" data-show><i class="fas fa-images" aria-hidden="true"></i> Show ${pl.photos.length === 1 ? 'photo' : `all ${pl.photos.length}`} in gallery</button>`;
        box.querySelector('[data-show]').addEventListener('click', () => { map.closePopup(); ARC.gallery.showPlace({ name: pl.name, locations: pl.match }); });
        box.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { map.closePopup(); ARC.gallery.openBySrc(b.dataset.open); }));
        return box;
    }

    async function build() {
        const holder = document.getElementById('travelMap');
        try {
            if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
                const css = document.createElement('link');
                css.rel = 'stylesheet'; css.href = LEAFLET_CSS; css.crossOrigin = 'anonymous';
                document.head.appendChild(css);
            }
            await loadScript(LEAFLET_JS, { crossorigin: 'anonymous' });
        } catch {
            holder.innerHTML = '<div class="map-fallback"><i class="fas fa-map-location-dot" aria-hidden="true"></i><p>The map couldn\'t load right now. Browse the places below instead.</p></div>';
            return;
        }
        const L = window.L;
        holder.innerHTML = '';
        map = L.map(holder, { scrollWheelZoom: false, worldCopyJump: true, zoomSnap: 0.25 });
        map.createPane('labels');
        map.getPane('labels').style.zIndex = 350; // above base tiles (200), below markers (400)
        map.getPane('labels').style.pointerEvents = 'none';
        // Esri "Canvas" basemaps (light & dark grey, with a separate label layer).
        // No API key, and they work without a Referer header — so the map also renders when the
        // page is opened straight from disk. (tile.openstreetmap.org blocks requests without a
        // Referer, and CARTO now requires an API key.)
        const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
        const TILES = {
            light: ['World_Light_Gray_Base', 'World_Light_Gray_Reference'],
            dark: ['World_Dark_Gray_Base', 'World_Dark_Gray_Reference']
        };
        const ATTRIBUTION = 'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> — Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, and the GIS user community';
        const themeNow = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
        const makeTiles = () => {
            const [base, labels] = TILES[themeNow()];
            const opts = { maxZoom: 18, maxNativeZoom: 16 };
            const baseLayer = L.tileLayer(`${ESRI}${base}/MapServer/tile/{z}/{y}/{x}`, { ...opts, attribution: ATTRIBUTION });
            const labelLayer = L.tileLayer(`${ESRI}${labels}/MapServer/tile/{z}/{y}/{x}`, { ...opts, pane: 'labels' });
            const group = L.layerGroup([baseLayer, labelLayer]);
            group.base = baseLayer;
            return group;
        };
        let tiles = makeTiles().addTo(map);

        // Follow the site's light/dark toggle. (Fresh layers, not setUrl(): setUrl() requests
        // tiles at fractional zoom levels like "4.5" when zoomSnap < 1, which fail.)
        new MutationObserver(() => {
            const next = makeTiles();
            watchErrors(next.base);
            next.addTo(map);
            next.base.once('load', () => {
                map.eachLayer((l) => { if (l instanceof L.LayerGroup && l !== next && l.base) map.removeLayer(l); });
                tiles = next;
            });
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // If tiles keep failing (offline, blocked network), say so instead of showing broken squares.
        let tileErrors = 0, tileLoads = 0, warned = false;
        function watchErrors(layer) {
            layer.on('tileload', () => { tileLoads++; });
            layer.on('tileerror', onTileError);
        }
        function onTileError() {
            tileErrors++;
            if (!warned && tileErrors >= 6 && tileLoads === 0) {
                warned = true;
                const note = document.createElement('div');
                note.className = 'map-tile-warning';
                note.innerHTML = '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Map background couldn\'t load (offline or blocked network). Markers still work — or use “Browse by place” below.';
                holder.appendChild(note);
            }
        }
        watchErrors(tiles.base);

        // Wheel zoom only after the visitor interacts, so the page doesn't get "stuck" while scrolling past.
        map.once('click focus', () => map.scrollWheelZoom.enable());

        const ordered = [...places].sort((a, b) => b.photos.length - a.photos.length); // big first, small on top
        ordered.forEach((pl) => {
            const area = pl.precision === 'area';
            const m = L.circleMarker([pl.lat, pl.lng], {
                radius: radius(pl.photos.length),
                color: area ? '#0a6cff' : '#ffffff',
                weight: area ? 2 : 1.5,
                dashArray: area ? '4 4' : null,
                fillColor: '#0a6cff',
                fillOpacity: area ? 0.18 : 0.78,
                className: area ? 'map-marker area' : 'map-marker'
            }).addTo(map);
            m.bindTooltip(`${escapeHtml(pl.name)} · ${pl.photos.length}`, { direction: 'top', offset: [0, -radius(pl.photos.length)] });
            // Zoom in to the place first, then open its popup (public API only).
            const open = () => L.popup({ maxWidth: 280, minWidth: 240, autoPanPadding: [16, 16], offset: [0, -radius(pl.photos.length) + 4] })
                .setLatLng([pl.lat, pl.lng]).setContent(popupFor(pl)).openOn(map);
            m.on('click', () => {
                m.closeTooltip();
                const target = Math.max(map.getZoom(), area ? 6 : 8);
                if (map.getZoom() >= target - 0.01) { open(); return; }
                map.once('moveend', open);
                map.flyTo([pl.lat, pl.lng], target, { duration: 0.6 });
            });
        });

        map.fitBounds(VIEWS.canada);
        document.querySelectorAll('[data-map-view]').forEach((b) => b.addEventListener('click', () => {
            document.querySelectorAll('[data-map-view]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            const v = b.dataset.mapView;
            if (v === 'all') map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng])), { padding: [24, 24] });
            else map.fitBounds(VIEWS[v]);
        }));
    }

    function init() {
        const holder = document.getElementById('travelMap');
        if (!holder || typeof PLACES === 'undefined') return;
        places = buildPlaces();
        stats();
        placeList();
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                if (entries.some((e) => e.isIntersecting)) { io.disconnect(); build(); }
            }, { rootMargin: '400px 0px' });
            io.observe(holder);
        } else {
            build();
        }
    }

    return { init, places: () => places };
})();
