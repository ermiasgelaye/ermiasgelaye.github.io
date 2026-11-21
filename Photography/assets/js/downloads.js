/* ARC-NATURE PHOTOGRAPHY — downloads, licensing & payments.
 * Talks to the existing backend (ARC.config.API_BASE_URL) with the same endpoints and payloads:
 *   /api/check-download-allowance, /api/register-download, /api/verify-unlimited,
 *   /api/download-unlimited, /api/register-device, /api/create-checkout-session,
 *   /api/create-paypal-order, /api/capture-paypal-order
 * The server is the source of truth; local state is only a cache / offline fallback. */
'use strict';

ARC.downloads = (() => {
    const { store, postJSON, escapeHtml, isEmail, loadScript } = ARC.util;
    const cfg = ARC.config;
    const FREE = cfg.FREE_DOWNLOADS_PER_YEAR;
    const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
    const UNLIMITED_KEYS = ['unlimited_unlocked', 'unlocked_date', 'unlocked_expiry', 'activation_code', 'unlimited_features'];

    const state = {
        userId: null,
        machineId: null,
        fingerprint: null,
        remaining: FREE,
        downloaded: new Set(),
        unlimited: false,
        activationCode: null,
        expiry: null,
        features: [],
        lastServerCheck: 0,
        purchaseOpen: false
    };
    let ready = null;
    const listeners = new Set();
    const emit = () => listeners.forEach((fn) => fn(getStatus()));

    /* ==================== Identity ==================== */

    function getUserIdentifier() {
        let id = store.get('photoUserId');
        const ts = parseInt(store.get('photoUserIdTimestamp', '0'), 10);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        // Never rotate the id of someone who paid — their purchase is tied to it.
        const paid = store.get('unlimited_unlocked') === 'true';
        if (!id || (!paid && Date.now() - ts > thirtyDays)) {
            id = btoa(`user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}_${Math.random().toString(36).slice(2, 11)}`);
            store.set('photoUserId', id);
            store.set('photoUserIdTimestamp', Date.now());
        }
        return id;
    }

    // NOTE: the fingerprint fields below are kept identical to the previous version so the
    // server keeps recognising returning visitors.
    function generateUserFingerprint() {
        const fp = {
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            userAgent: navigator.userAgent,
            languages: navigator.languages?.join(',') || navigator.language,
            doNotTrack: navigator.doNotTrack || 'unknown',
            canvasFingerprint: canvasFp(),
            webglFingerprint: webglFp(),
            // The old AudioContext probe always hashed an empty (suspended) buffer to "0".
            // Same value, without creating an AudioContext on page load.
            audioFingerprint: (window.AudioContext || window.webkitAudioContext) ? '0' : 'audio_not_supported',
            fontsFingerprint: fontsFp(),
            cpuCores: navigator.hardwareConcurrency || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            pdfViewerEnabled: navigator.pdfViewerEnabled || false
        };
        try { return btoa(unescape(encodeURIComponent(JSON.stringify(fp)))); } catch { return 'fp_unavailable'; }
    }
    function canvasFp() {
        try {
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            c.width = 200; c.height = 50;
            ctx.textBaseline = 'alphabetic';
            ctx.font = "14px 'Arial'";
            ctx.fillStyle = '#f60'; ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069'; ctx.fillText('Fingerprint', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'; ctx.fillText('Fingerprint', 4, 17);
            return c.toDataURL().substring(22);
        } catch { return 'canvas_not_supported'; }
    }
    function webglFp() {
        try {
            const gl = document.createElement('canvas').getContext('webgl');
            if (!gl) return 'webgl_not_supported';
            const dbg = gl.getExtension('WEBGL_debug_renderer_info');
            const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
            const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
            return `${vendor}|${renderer}`;
        } catch { return 'webgl_error'; }
    }
    function fontsFp() {
        try {
            const fonts = ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia', 'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings'];
            const ctx = document.createElement('canvas').getContext('2d');
            const t = 'mmmmmmmmmmlli';
            const measure = () => { const m = ctx.measureText(t); return [m.width, m.actualBoundingBoxAscent || 50]; };
            ctx.font = '72px monospace';
            const [bw, bh] = measure();
            return fonts.filter((f) => { ctx.font = `72px "${f}", monospace`; const [w, h] = measure(); return w !== bw || h !== bh; }).join(',');
        } catch { return ''; }
    }

    function generateMachineId() {
        try {
            const info = JSON.stringify({
                platform: navigator.platform, screenRes: `${screen.width}x${screen.height}`, colorDepth: screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, language: navigator.language,
                hardwareConcurrency: navigator.hardwareConcurrency, deviceMemory: navigator.deviceMemory,
                hasTouch: 'ontouchstart' in window, pixelRatio: window.devicePixelRatio, doNotTrack: navigator.doNotTrack,
                plugins: Array.from(navigator.plugins || []).map((p) => p.name).join(',')
            });
            let h = 0;
            for (let i = 0; i < info.length; i++) { h = ((h << 5) - h) + info.charCodeAt(i); h |= 0; }
            return `machine_${Math.abs(h).toString(16)}`;
        } catch {
            return `machine_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        }
    }

    // IndexedDB copy of the machine id (survives localStorage clears). Every path resolves.
    function idb(mode, value) {
        return new Promise((resolve) => {
            try {
                const req = indexedDB.open('PhotoGalleryDB', 1);
                req.onupgradeneeded = () => {
                    if (!req.result.objectStoreNames.contains('machineInfo')) req.result.createObjectStore('machineInfo', { keyPath: 'id' });
                };
                req.onerror = () => resolve(null);
                req.onsuccess = () => {
                    try {
                        const db = req.result;
                        if (!db.objectStoreNames.contains('machineInfo')) { db.close(); resolve(null); return; }
                        const tx = db.transaction(['machineInfo'], mode === 'put' ? 'readwrite' : 'readonly');
                        const os = tx.objectStore('machineInfo');
                        if (mode === 'put') {
                            os.put({ id: 'machineId', value, timestamp: Date.now() });
                            tx.oncomplete = () => { db.close(); resolve(true); };
                            tx.onerror = () => { db.close(); resolve(null); };
                        } else {
                            const g = os.get('machineId');
                            g.onsuccess = () => { db.close(); resolve(g.result?.value || null); };
                            g.onerror = () => { db.close(); resolve(null); };
                        }
                    } catch { resolve(null); }
                };
            } catch { resolve(null); }
        });
    }

    async function initMachineId() {
        let id = store.get('machineId');
        const fromDb = await idb('get');
        if (fromDb) id = fromDb;
        if (!id) id = generateMachineId();
        store.set('machineId', id);
        if (id !== fromDb) await idb('put', id);
        return id;
    }

    /* ==================== Local cache ==================== */

    function readUnlimitedLocal() {
        const expiry = parseInt(store.get('unlocked_expiry', '0'), 10);
        if (store.get('unlimited_unlocked') === 'true' && expiry && Date.now() > expiry) clearUnlimitedLocal();
        state.unlimited = store.get('unlimited_unlocked') === 'true';
        if (state.unlimited) {
            state.activationCode = store.get('activation_code');
            state.expiry = parseInt(store.get('unlocked_expiry', '0'), 10) || null;
            state.features = store.getJSON('unlimited_features', []) || [];
        }
        return state.unlimited;
    }
    function writeUnlimitedLocal({ activationCode, expires, features }) {
        state.unlimited = true;
        if (activationCode) state.activationCode = activationCode;
        state.expiry = Number(new Date(expires || Date.now() + YEAR_MS)) || Date.now() + YEAR_MS;
        state.features = features || state.features || [];
        store.set('unlimited_unlocked', 'true');
        store.set('unlocked_date', Date.now());
        store.set('unlocked_expiry', state.expiry);
        if (state.activationCode) store.set('activation_code', state.activationCode);
        store.setJSON('unlimited_features', state.features);
    }
    function clearUnlimitedLocal() {
        UNLIMITED_KEYS.forEach((k) => store.remove(k));
        Object.assign(state, { unlimited: false, activationCode: null, expiry: null, features: [] });
    }

    function loadLocal() {
        const year = new Date().getFullYear();
        if (parseInt(store.get('downloadResetYear', '0'), 10) < year) {
            // New calendar year: free quota resets (paid access is governed by its own expiry date).
            store.set('downloadResetYear', year);
            state.remaining = FREE;
            state.downloaded = new Set();
            saveLocal();
        }
        readUnlimitedLocal();
        const s = store.getJSON('photoDownloadState', {});
        if (s && s.userId === state.userId && s.year === year) {
            state.remaining = Number.isFinite(s.downloadsRemaining) ? s.downloadsRemaining : FREE;
            state.downloaded = new Set(s.downloadedImages || []);
        }
    }
    function saveLocal() {
        store.setJSON('photoDownloadState', {
            userId: state.userId,
            downloadsRemaining: state.remaining,
            downloadedImages: [...state.downloaded],
            timestamp: Date.now(),
            year: new Date().getFullYear()
        });
        store.set('downloadsRemaining', state.remaining);
        emit();
    }

    /* ==================== Server sync ==================== */

    const identity = () => ({ userId: state.userId, userFingerprint: state.fingerprint, machineId: state.machineId });

    async function checkAllowance() {
        try {
            const { ok, data } = await postJSON('/api/check-download-allowance', identity());
            if (!ok || !data) return false;
            if (data.unlimitedAccess) {
                writeUnlimitedLocal({ expires: data.expires, features: data.features });
            } else if (Number.isFinite(data.remainingDownloads)) {
                state.remaining = data.remainingDownloads;
            }
            state.lastServerCheck = Date.now();
            saveLocal();
            return data;
        } catch {
            return false; // offline / backend down: keep cached state
        }
    }

    /** @returns {Promise<boolean|null>} true / false from the server, null when the server could not be reached. */
    async function verifyUnlimited() {
        try {
            const { ok, data } = await postJSON('/api/verify-unlimited', {
                userId: state.userId, machineId: state.machineId, activationCode: state.activationCode
            });
            if (!ok || !data) return null;
            if (data.hasUnlimited) {
                writeUnlimitedLocal({ expires: data.expires, features: data.features });
                return true;
            }
            return false;
        } catch {
            return null;
        }
    }

    function init() {
        state.userId = getUserIdentifier();
        loadLocal();
        emit();
        ready = (async () => {
            state.machineId = await initMachineId();
            // Fingerprinting is CPU work: do it when the browser is idle.
            await new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 2000 }) : setTimeout(r, 300)));
            state.fingerprint = generateUserFingerprint();
            await checkAllowance();
            await handlePaymentReturn();
        })();
        return ready;
    }

    /* ==================== Download flow ==================== */

    async function download(photo) {
        await ready;
        let unlimited = false;
        if (readUnlimitedLocal()) {
            const v = await verifyUnlimited();
            if (v === false) {
                clearUnlimitedLocal();
                saveLocal();
                ARC.toast('Your unlimited access could not be confirmed. Contact support if you believe this is a mistake.', { type: 'error', timeout: 6000 });
            } else {
                unlimited = true; // true, or server unreachable: honour the cached purchase
            }
        }

        if (unlimited) return downloadUnlimited(photo);

        const again = state.downloaded.has(photo.src);
        if (!again && state.remaining <= 0) {
            const fresh = await checkAllowance();
            if (!(fresh && (fresh.canDownload || fresh.remainingDownloads > 0))) {
                openPurchase({ reason: 'limit' });
                return;
            }
        }
        if (!again) {
            const ok = await ARC.modal.confirm({
                title: 'Confirm download',
                confirmText: '<i class="fas fa-download" aria-hidden="true"></i> Download',
                body: `<p>You have <strong>${state.remaining}</strong> free download${state.remaining === 1 ? '' : 's'} left this year.</p>
                    <div class="counter-ring">${state.remaining}/${FREE}</div>
                    <p>Download <strong>${escapeHtml(photo.title)}</strong>? Free downloads are web-size with a watermark and for personal use.</p>`
            });
            if (!ok) return;
        }

        const reg = await registerDownload(photo, again);
        if (!reg.success) { openPurchase({ reason: 'limit' }); return; }
        if (reg.unlimited) return downloadUnlimited(photo, true);

        await saveWatermarked(photo);
        ARC.toast(again ? 'Downloaded again (no extra download used).' : `Download complete, ${state.remaining} free download${state.remaining === 1 ? '' : 's'} left this year.`, { type: 'success', icon: 'fa-download' });
    }

    async function registerDownload(photo, again) {
        try {
            const { ok, data } = await postJSON('/api/register-download', { ...identity(), imageId: photo.src, imageTitle: photo.title });
            if (ok && data) {
                if (data.unlimitedAccess) {
                    writeUnlimitedLocal({ expires: data.expires, features: data.features });
                    state.downloaded.add(photo.src); saveLocal();
                    return { success: true, unlimited: true };
                }
                if (data.success) {
                    if (Number.isFinite(data.remainingDownloads)) state.remaining = data.remainingDownloads;
                    state.downloaded.add(photo.src); saveLocal();
                    return { success: true };
                }
                if (again) return { success: true };
                state.remaining = 0; saveLocal();
                return { success: false };
            }
        } catch { /* fall through to local */ }
        // Offline fallback
        if (again) return { success: true };
        if (state.remaining <= 0) return { success: false };
        state.remaining -= 1;
        state.downloaded.add(photo.src);
        saveLocal();
        setTimeout(checkAllowance, 1500);
        return { success: true };
    }

    async function downloadUnlimited(photo, alreadyRegistered = false) {
        let count = null;
        if (!alreadyRegistered) {
            try {
                const { ok, data } = await postJSON('/api/download-unlimited', {
                    userId: state.userId, machineId: state.machineId, activationCode: state.activationCode,
                    imageId: photo.src, imageTitle: photo.title
                });
                if (ok && data?.success) count = data.downloadsCount;
            } catch { /* still allow: paid user */ }
        }
        state.downloaded.add(photo.src);
        saveLocal();
        saveOriginal(photo);
        ARC.toast(`Full-resolution download started, no watermark, commercial licence${count ? ` (download #${count})` : ''}.`, { type: 'success', icon: 'fa-crown', timeout: 4500 });
    }

    const fileName = (photo, suffix = '') => `${photo.title.replace(/[^\w\-]+/g, '_').replace(/_+/g, '_')}${suffix}.jpg`;

    function saveOriginal(photo) {
        const a = document.createElement('a');
        a.href = photo.src;
        a.download = fileName(photo);
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    async function saveWatermarked(photo) {
        try {
            const img = new Image();
            img.decoding = 'async';
            img.src = photo.src;
            await img.decode();
            // Free downloads are capped at 2048px on the long edge.
            const scale = Math.min(1, 2048 / Math.max(img.naturalWidth, img.naturalHeight));
            const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);

            const size = Math.max(16, Math.round(w / 45));
            const text = `© ${photo.photographer || cfg.PHOTOGRAPHER} · ARC-NATURE PHOTOGRAPHY`;
            ctx.font = `600 ${size}px Inter, Arial, sans-serif`;
            const tw = ctx.measureText(text).width;
            const pad = size * 0.6;
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.fillRect(w - tw - pad * 3, h - size - pad * 3, tw + pad * 2, size + pad * 1.6);
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
            ctx.fillText(text, w - pad * 2, h - pad * 1.8);
            // Faint diagonal mark across the centre
            ctx.save();
            ctx.translate(w / 2, h / 2);
            ctx.rotate(-Math.PI / 8);
            ctx.font = `700 ${size * 2.4}px Inter, Arial, sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(255,255,255,0.14)';
            ctx.fillText('ARC-NATURE PHOTOGRAPHY', 0, 0);
            ctx.restore();

            const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.9));
            if (!blob) throw new Error('encode failed');
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = fileName(photo, '_watermarked');
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 4000);
        } catch (err) {
            console.error('Watermarked download failed:', err);
            ARC.toast('Sorry, the download could not be prepared. Please try again.', { type: 'error' });
        }
    }

    /* ==================== Purchase / payments ==================== */

    function openPurchase({ reason = 'general', photo = null } = {}) {
        if (readUnlimitedLocal()) { ARC.toast('You already have unlimited access. Enjoy!', { type: 'success', icon: 'fa-crown' }); return; }
        if (state.purchaseOpen) return;
        state.purchaseOpen = true;

        const intro = {
            limit: `You've used all ${FREE} free downloads for this year. Unlock unlimited full-resolution downloads.`,
            early: `Get every photo in full resolution, without watermarks, with a commercial licence.`,
            general: `Get every photo in full resolution, without watermarks, with a commercial licence.`
        }[reason] || '';

        const m = ARC.modal.open({
            label: 'Unlock unlimited downloads',
            onClose: () => { state.purchaseOpen = false; },
            html: `<h2><i class="fas fa-crown" style="color:var(--warning)" aria-hidden="true"></i> Unlimited downloads</h2>
                <p>${intro}</p>
                <div class="price-box"><div class="price">${cfg.UNLIMITED_PRICE}</div><div>One-time payment · valid for 1 year</div></div>
                <ul class="feature-list">
                    <li><i class="fas fa-check" aria-hidden="true"></i>Unlimited full-resolution downloads for 1 year</li>
                    <li><i class="fas fa-check" aria-hidden="true"></i>No watermarks</li>
                    <li><i class="fas fa-check" aria-hidden="true"></i>Commercial usage licence</li>
                    <li><i class="fas fa-check" aria-hidden="true"></i>Priority email support</li>
                </ul>
                <label class="form-label" for="payEmail"><i class="fas fa-envelope" aria-hidden="true"></i> Email for your receipt</label>
                <input type="email" class="form-control" id="payEmail" placeholder="you@example.com" autocomplete="email" required>
                <div class="pay-error" aria-live="assertive"></div>
                <div class="pay-methods">
                    <button type="button" class="btn-brand" data-stripe><i class="fas fa-credit-card" aria-hidden="true"></i> Pay with card</button>
                    <div id="paypal-button-container" aria-label="PayPal checkout"></div>
                </div>
                ${reason === 'early' && photo && state.remaining > 0 ? `<div class="modal-actions"><button type="button" class="btn-outline" data-free><i class="fas fa-download" aria-hidden="true"></i> Use a free download instead (${state.remaining} left)</button></div>` : ''}
                <p class="note"><i class="fas fa-lock" aria-hidden="true"></i> Secure checkout by Stripe or PayPal · 30-day money-back guarantee · Access is tied to this browser/device: keep your activation code.</p>`
        });

        const card = m.el;
        const emailInput = card.querySelector('#payEmail');
        const errBox = card.querySelector('.pay-error');
        const showErr = (msg) => { errBox.innerHTML = msg ? `<div class="inline-alert error">${escapeHtml(msg)}</div>` : ''; };
        const getEmail = () => {
            const v = emailInput.value.trim();
            if (!isEmail(v)) { showErr('Please enter a valid email address for your receipt.'); emailInput.focus(); return null; }
            showErr('');
            return v;
        };

        card.querySelector('[data-free]')?.addEventListener('click', () => { m.close(); setTimeout(() => download(photo), 50); });

        const stripeBtn = card.querySelector('[data-stripe]');
        stripeBtn.addEventListener('click', async () => {
            const email = getEmail();
            if (!email) return;
            const label = stripeBtn.innerHTML;
            stripeBtn.disabled = true;
            stripeBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Redirecting to checkout…';
            try {
                const { ok, data } = await postJSON('/api/create-checkout-session', { userId: state.userId, email });
                if (!ok || !data) throw new Error('Could not start checkout');
                if (data.url) { window.location.assign(data.url); return; }
                await loadScript('https://js.stripe.com/v3/');
                const stripe = window.Stripe(cfg.STRIPE_PUBLIC_KEY);
                const result = await stripe.redirectToCheckout({ sessionId: data.id });
                if (result?.error) throw new Error(result.error.message);
            } catch (err) {
                showErr(`${err.message || 'Payment could not be started'}. Please try again or use PayPal.`);
                stripeBtn.disabled = false;
                stripeBtn.innerHTML = label;
            }
        });

        renderPayPal(card, getEmail, showErr, m);
    }

    async function renderPayPal(card, getEmail, showErr, modalRef) {
        const box = card.querySelector('#paypal-button-container');
        box.innerHTML = '<p class="note"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading PayPal…</p>';
        try {
            await loadScript(`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.PAYPAL_CLIENT_ID)}&currency=USD&components=buttons`);
        } catch {
            box.innerHTML = '<p class="note">PayPal is unavailable right now. Please pay by card or try again later.</p>';
            return;
        }
        if (!card.isConnected) return;
        box.innerHTML = '';
        let email = null;
        window.paypal.Buttons({
            style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'paypal', height: 45 },
            onClick: (_data, actions) => { email = getEmail(); return email ? actions.resolve() : actions.reject(); },
            createOrder: async () => {
                const { ok, data } = await postJSON('/api/create-paypal-order', { userId: state.userId, email });
                if (!ok || !data?.id) { showErr('Could not create the PayPal order. Please try again.'); throw new Error('order failed'); }
                return data.id;
            },
            onApprove: async (data) => {
                try {
                    const { ok, data: result } = await postJSON('/api/capture-paypal-order', {
                        orderID: data.orderID, userId: state.userId, email, machineId: state.machineId
                    }, { timeout: 20000 });
                    if (!ok || !result?.success) throw new Error('capture failed');
                    modalRef.close();
                    await activate({ paymentId: data.orderID, method: 'paypal', email, paymentConfirmed: true });
                } catch {
                    showErr('PayPal approved the payment, but we could not confirm it. You have not been charged twice: please contact support with your PayPal receipt.');
                }
            },
            onError: () => showErr('PayPal reported an error. Please try again or pay by card.')
        }).render(box).catch(() => { box.innerHTML = '<p class="note">PayPal could not be displayed. Please pay by card.</p>'; });
    }

    /**
     * Registers this device for unlimited access after a payment.
     * paymentConfirmed=true means the server already confirmed the charge (PayPal capture),
     * so a local grant is acceptable if device registration temporarily fails.
     */
    async function activate({ paymentId, method, email, paymentConfirmed = false }) {
        try {
            const { ok, data } = await postJSON('/api/register-device', {
                userId: state.userId, machineId: state.machineId,
                paymentId: paymentId || `payment_${Date.now()}`, paymentMethod: method || 'unknown', email: email || null
            }, { timeout: 20000 });
            if (!ok || !data) throw new Error('register failed');
            writeUnlimitedLocal({ activationCode: data.activationCode, expires: data.expires, features: data.features });
        } catch {
            if (!paymentConfirmed) {
                ARC.modal.open({
                    label: 'Activation pending',
                    html: `<h2>Activation pending</h2>
                        <p>We received your return from checkout but couldn't confirm the activation with our server yet.</p>
                        <p>Please refresh in a minute. If it still doesn't work, email <a href="mailto:${escapeHtml(cfg.CONTACT_EMAIL)}">${escapeHtml(cfg.CONTACT_EMAIL)}</a> with your payment reference${paymentId ? ` <code>${escapeHtml(paymentId)}</code>` : ''}.</p>`
                });
                return false;
            }
            writeUnlimitedLocal({ activationCode: `local_${Date.now()}`, expires: Date.now() + YEAR_MS });
        }
        saveLocal();
        showActivated(email);
        return true;
    }

    function showActivated(email) {
        const exp = state.expiry ? new Date(state.expiry).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'n/a';
        const m = ARC.modal.open({
            label: 'Unlimited access activated',
            html: `<h2><i class="fas fa-crown" style="color:var(--warning)" aria-hidden="true"></i> Unlimited access activated</h2>
                <p>Thank you for supporting my photography!</p>
                <div class="price-box" style="text-align:left">
                    <div><strong>Activation code:</strong> <code>${escapeHtml(state.activationCode || 'n/a')}</code></div>
                    <div><strong>Valid until:</strong> ${escapeHtml(exp)}</div>
                    ${email ? `<div><strong>Receipt email:</strong> ${escapeHtml(email)}</div>` : ''}
                </div>
                <div class="inline-alert info">Access is tied to this browser/device. Save your activation code: you'll need it to move access to another device.</div>
                <div class="modal-actions"><button type="button" class="btn-brand" data-go><i class="fas fa-images" aria-hidden="true"></i> Start downloading</button></div>`
        });
        m.el.querySelector('[data-go]').addEventListener('click', () => { m.close(); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); });
    }

    // Stripe redirects back with ?payment=success&userId=…&paymentId=…
    async function handlePaymentReturn() {
        const p = new URLSearchParams(location.search);
        if (p.get('payment') !== 'success') return;
        const clean = () => { p.delete('payment'); p.delete('userId'); p.delete('email'); p.delete('method'); p.delete('paymentId'); p.delete('session_id');
            history.replaceState({}, document.title, `${location.pathname}${p.toString() ? `?${p}` : ''}${location.hash}`); };
        if (p.get('userId') && p.get('userId') !== state.userId) { clean(); return; }
        const args = { paymentId: p.get('paymentId') || p.get('session_id'), method: p.get('method') || 'stripe', email: p.get('email') };
        clean();
        await activate(args);
    }

    /* ==================== Public ==================== */

    function getStatus() {
        return {
            unlimited: state.unlimited,
            remaining: state.remaining,
            free: FREE,
            expiry: state.expiry,
            activationCode: state.activationCode
        };
    }
    const onChange = (fn) => { listeners.add(fn); fn(getStatus()); return () => listeners.delete(fn); };

    return { init, download, openPurchase, getStatus, onChange };
})();
