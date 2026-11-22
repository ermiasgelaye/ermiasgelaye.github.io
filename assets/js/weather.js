/* Weather Analysis — statistics and interactive charts computed from Resources/cities.csv.
 * Every number shown on the overview and comparison pages is calculated here from the data,
 * so the page can't drift from what the dataset actually says. */
'use strict';

const Weather = (() => {
    const VARS = {
        temp: { col: 'Max Temp', label: 'Max temperature', unit: '°F', icon: 'temperature-high' },
        humidity: { col: 'Humidity', label: 'Humidity', unit: '%', icon: 'droplet' },
        cloudiness: { col: 'Cloudiness', label: 'Cloudiness', unit: '%', icon: 'cloud' },
        wind: { col: 'Wind Speed', label: 'Wind speed', unit: 'mph', icon: 'wind' }
    };

    /* ---------- Statistics ---------- */
    function betacf(a, b, x) {
        const FPMIN = 1e-300; let c = 1, d = 1 - (a + b) * x / (a + 1); if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; let h = d;
        for (let m = 1; m <= 300; m++) {
            const m2 = 2 * m;
            let aa = m * (b - m) * x / ((a - 1 + m2) * (a + m2));
            d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
            aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + 1 + m2));
            d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
            const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break;
        }
        return h;
    }
    const lgamma = (z) => { // Lanczos approximation
        const g = 7, cf = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61503916999185, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
        if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
        z -= 1; let x = cf[0]; for (let i = 1; i < g + 2; i++) x += cf[i] / (z + i);
        const t = z + g + 0.5; return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
    };
    function betai(a, b, x) {
        if (x <= 0) return 0; if (x >= 1) return 1;
        const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
        return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
    }
    /** Pearson correlation + OLS line + two-sided p-value for r ≠ 0. */
    function regress(xs, ys) {
        const n = xs.length, mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
        let sxx = 0, syy = 0, sxy = 0;
        for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; }
        const r = sxy / Math.sqrt(sxx * syy), slope = sxy / sxx, intercept = my - slope * mx;
        const df = n - 2, t = r * Math.sqrt(df / (1 - r * r));
        return { n, r, r2: r * r, slope, intercept, p: betai(df / 2, 0.5, df / (df + t * t)) };
    }
    const strength = (r2, p) => p >= 0.05 ? ['none', 'No significant relationship'] : r2 >= 0.5 ? ['strong', 'Strong'] : r2 >= 0.2 ? ['moderate', 'Moderate'] : ['weak', 'Weak'];
    const fmtP = (p) => p < 0.001 ? '< 0.001' : p.toFixed(3);
    const fmt = (v, d = 2) => (Math.abs(v) < 0.005 && d === 2 ? v.toFixed(3) : v.toFixed(d));

    /* ---------- Data ---------- */
    let cache = null;
    async function load() {
        if (cache) return cache;
        const text = await DataTable.getCSVText('Resources/cities.csv');
        const rows = DataTable.parseCSV(text).map((r) => ({
            city: r.City, country: r.Country, lat: +r.Lat, lng: +r.Lng, date: +r.Date,
            temp: +r['Max Temp'], humidity: +r.Humidity, cloudiness: +r.Cloudiness, wind: +r['Wind Speed']
        })).filter((r) => Number.isFinite(r.lat));
        const stats = {};
        for (const k of Object.keys(VARS)) {
            const N = rows.filter((r) => r.lat >= 0), S = rows.filter((r) => r.lat < 0);
            stats[k] = {
                all: regress(rows.map((r) => r.lat), rows.map((r) => r[k])),
                north: regress(N.map((r) => r.lat), N.map((r) => r[k])),
                south: regress(S.map((r) => r.lat), S.map((r) => r[k])),
                abs: regress(rows.map((r) => Math.abs(r.lat)), rows.map((r) => r[k]))
            };
        }
        const dates = rows.map((r) => r.date).sort((a, b) => a - b);
        cache = { rows, stats, north: rows.filter((r) => r.lat >= 0).length, south: rows.filter((r) => r.lat < 0).length,
            countries: new Set(rows.map((r) => r.country)).size, date: new Date(dates[0] * 1000) };
        return cache;
    }

    /* ---------- Rendering helpers ---------- */
    const capitalize = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
    const tooltip = (k) => (ctx) => {
        const r = ctx.raw.row; if (!r) return ctx.dataset.label;
        return `${capitalize(r.city)}, ${r.country}: ${r[k]} ${VARS[k].unit} at ${r.lat.toFixed(1)}°`;
    };
    function scatterConfig(k, data, { showNorth = true, showSouth = true, compact = false } = {}) {
        const c = ARC.themeColors();
        const N = data.rows.filter((r) => r.lat >= 0), S = data.rows.filter((r) => r.lat < 0);
        const line = (st, x0, x1) => [{ x: x0, y: st.intercept + st.slope * x0 }, { x: x1, y: st.intercept + st.slope * x1 }];
        const sn = data.stats[k].north, ss = data.stats[k].south;
        const ds = [];
        if (showNorth) ds.push({ type: 'scatter', label: 'Northern hemisphere', data: N.map((r) => ({ x: r.lat, y: r[k], row: r })), backgroundColor: 'rgba(10,108,255,.55)', borderColor: 'rgba(10,108,255,.9)', pointRadius: compact ? 2 : 3.2, pointHoverRadius: 6 });
        if (showSouth) ds.push({ type: 'scatter', label: 'Southern hemisphere', data: S.map((r) => ({ x: r.lat, y: r[k], row: r })), backgroundColor: 'rgba(234,88,12,.55)', borderColor: 'rgba(234,88,12,.9)', pointRadius: compact ? 2 : 3.2, pointHoverRadius: 6 });
        if (showNorth) ds.push({ type: 'line', label: `North fit (R² ${sn.r2.toFixed(2)})`, data: line(sn, 0, 80), borderColor: '#0a6cff', borderWidth: 2.5, pointRadius: 0, borderDash: sn.p < 0.05 ? [] : [6, 6] });
        if (showSouth) ds.push({ type: 'line', label: `South fit (R² ${ss.r2.toFixed(2)})`, data: line(ss, -60, 0), borderColor: '#ea580c', borderWidth: 2.5, pointRadius: 0, borderDash: ss.p < 0.05 ? [] : [6, 6] });
        return {
            data: { datasets: ds },
            options: {
                responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
                interaction: { mode: 'nearest', intersect: true },
                plugins: {
                    legend: { display: !compact, labels: { color: c.ink2, usePointStyle: true, boxWidth: 8 } },
                    tooltip: { callbacks: { label: tooltip(k) } }
                },
                scales: {
                    x: { type: 'linear', min: -60, max: 80, title: { display: !compact, text: 'Latitude (°)', color: c.ink3 }, grid: { color: c.border }, ticks: { color: c.ink3 } },
                    y: { title: { display: !compact, text: `${VARS[k].label} (${VARS[k].unit})`, color: c.ink3 }, grid: { color: c.border }, ticks: { color: c.ink3 } }
                }
            }
        };
    }

    /* ---------- Overview: KPIs, explorer, stat cards ---------- */
    async function initOverview() {
        let data;
        try { data = await load(); } catch {
            document.querySelectorAll('[data-needs-data]').forEach((e) => { e.innerHTML = '<div class="alert err">The dataset couldn\'t be loaded. <a href="Resources/cities.csv">Download cities.csv</a>.</div>'; });
            return;
        }
        const set = (sel, v) => document.querySelectorAll(sel).forEach((e) => { e.textContent = v; });
        set('[data-kpi="cities"]', data.rows.length.toLocaleString());
        set('[data-kpi="countries"]', data.countries);
        set('[data-kpi="split"]', `${data.north} / ${data.south}`);
        set('[data-kpi="date"]', data.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }));

        renderStatCards(data);
        renderStatsTable(data);

        const canvas = document.getElementById('explorerChart');
        if (!canvas) return;
        let Chart;
        try { Chart = await ARC.loadChartJs(); } catch {
            canvas.closest('.chart-box').innerHTML = '<div class="alert err">The interactive chart couldn\'t load. The original figures are below.</div>';
            return;
        }
        let current = 'temp', chart = null;
        const opts = () => ({ showNorth: document.getElementById('showNorth').checked, showSouth: document.getElementById('showSouth').checked });
        const draw = () => {
            chart?.destroy();
            const cfg = scatterConfig(current, data, opts());
            chart = new Chart(canvas, { type: 'scatter', ...cfg });
            const s = data.stats[current];
            document.getElementById('explorerNote').innerHTML =
                `Northern hemisphere: r = ${s.north.r.toFixed(2)}, R² = ${s.north.r2.toFixed(2)}, p ${fmtP(s.north.p).startsWith('<') ? '' : '= '}${fmtP(s.north.p)} · ` +
                `Southern hemisphere: r = ${s.south.r.toFixed(2)}, R² = ${s.south.r2.toFixed(2)}, p ${fmtP(s.south.p).startsWith('<') ? '' : '= '}${fmtP(s.south.p)}. Dashed fit lines are not statistically significant (p ≥ 0.05).`;
        };
        document.querySelectorAll('[data-var]').forEach((b) => b.addEventListener('click', () => {
            current = b.dataset.var;
            document.querySelectorAll('[data-var]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            draw();
        }));
        ['showNorth', 'showSouth'].forEach((id) => document.getElementById(id).addEventListener('change', draw));
        document.addEventListener('themechange', draw);
        draw();
    }

    const pEq = (p) => (p < 0.001 ? 'p < 0.001' : `p = ${p.toFixed(3)}`);
    const pct = (r2) => `${Math.max(1, Math.round(r2 * 100))}%`;

    function renderStatCards(data) {
        const box = document.getElementById('statCards');
        if (!box) return;
        const explain = {
            temp: (s) => `Temperature falls with distance from the equator in both hemispheres. On ${data.date.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', timeZone: 'UTC' })} (northern summer), each degree of latitude north lowers max temperature by about ${Math.abs(s.north.slope).toFixed(2)} °F.`,
            humidity: (s) => `A weak link in the northern hemisphere (${pEq(s.north.p)}), none in the south. Latitude explains at most ${pct(Math.max(s.north.r2, s.south.r2))} of the variation in humidity; local factors such as proximity to water dominate.`,
            cloudiness: (s) => `A weak link in the northern hemisphere (${pEq(s.north.p)}), none in the south. Latitude explains at most ${pct(Math.max(s.north.r2, s.south.r2))} of the variation: cloud cover varies widely at every latitude and clusters at reported values such as 0%, 20%, 75% and 92%.`,
            wind: () => 'No significant relationship in either hemisphere: most cities report light winds whatever their latitude.'
        };
        box.innerHTML = Object.entries(VARS).map(([k, v]) => {
            const s = data.stats[k];
            // Rate the card by the strongest *significant* hemisphere, so it agrees with the table below
            const sig = [s.north, s.south].filter((h) => h.p < 0.05);
            const best = sig.length ? sig.reduce((a, b) => (b.r2 > a.r2 ? b : a)) : (s.north.r2 >= s.south.r2 ? s.north : s.south);
            const [cls, label] = strength(best.r2, best.p);
            return `<article class="card stat-card">
                <h3><span><i class="fas fa-${v.icon}" aria-hidden="true"></i> ${v.label}</span><span class="strength ${cls}">${label}</span></h3>
                <dl>
                    <dt>R² north</dt><dd>${s.north.r2.toFixed(2)} <small>(${pEq(s.north.p)})</small></dd>
                    <dt>R² south</dt><dd>${s.south.r2.toFixed(2)} <small>(${pEq(s.south.p)})</small></dd>
                </dl>
                <p>${explain[k](s)}</p>
            </article>`;
        }).join('');
    }

    function renderStatsTable(data) {
        const tb = document.getElementById('statsTable');
        if (!tb) return;
        tb.innerHTML = Object.entries(VARS).flatMap(([k, v]) => ['north', 'south', 'all'].map((h, i) => {
            const s = data.stats[k][h];
            const [cls, label] = strength(s.r2, s.p);
            return `<tr>${i === 0 ? `<th scope="rowgroup" rowspan="3">${v.label}</th>` : ''}
                <td>${{ north: 'Northern', south: 'Southern', all: 'All cities' }[h]}</td>
                <td class="num">${s.n}</td><td class="num">${s.r.toFixed(3)}</td><td class="num">${s.r2.toFixed(3)}</td>
                <td class="num">${fmt(s.slope, 3)}</td><td class="num">${fmtP(s.p)}</td><td><span class="strength ${cls}">${label}</span></td></tr>`;
        })).join('');
    }

    /* ---------- Comparison page: small multiples ---------- */
    async function initComparison() {
        let data, Chart;
        try { data = await load(); } catch { return; }
        renderStatsTable(data);
        renderStatCards(data);
        try { Chart = await ARC.loadChartJs(); } catch { return; }
        const charts = {};
        const draw = () => document.querySelectorAll('canvas[data-mini]').forEach((cv) => {
            const k = cv.dataset.mini;
            charts[k]?.destroy();
            charts[k] = new Chart(cv, { type: 'scatter', ...scatterConfig(k, data, { compact: true }) });
        });
        document.addEventListener('themechange', draw);
        draw();
    }

    return { load, regress, initOverview, initComparison, VARS, fmtP };
})();
