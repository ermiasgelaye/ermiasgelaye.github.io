/* Pharmaceutical Data Analysis — study-population charts computed from Resources/mouse_metadata.csv. */
'use strict';

const Pharma = (() => {
    let cache = null;
    async function load() {
        if (cache) return cache;
        const rows = DataTable.parseCSV(await DataTable.getCSVText('Resources/mouse_metadata.csv'))
            .map((r) => ({ id: r['Mouse ID'], regimen: r['Drug Regimen'], sex: r.Sex, age: +r.Age_months, weight: +r['Weight (g)'] }));
        const by = {};
        rows.forEach((r) => { (by[r.regimen] ||= []).push(r); });
        const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
        const regimens = Object.keys(by).sort((a, b) => mean(by[a].map((r) => r.weight)) - mean(by[b].map((r) => r.weight)));
        const summary = regimens.map((g) => ({ regimen: g, n: by[g].length, weight: mean(by[g].map((r) => r.weight)), age: mean(by[g].map((r) => r.age)), female: by[g].filter((r) => r.sex === 'Female').length }));
        cache = { rows, summary, mean };
        return cache;
    }

    async function initOverview() {
        let d;
        try { d = await load(); } catch {
            document.querySelectorAll('[data-needs-data]').forEach((e) => { e.innerHTML = '<div class="alert err">The dataset couldn\'t be loaded. <a href="Resources/mouse_metadata.csv">Download mouse_metadata.csv</a>.</div>'; });
            return;
        }
        const set = (sel, v) => document.querySelectorAll(sel).forEach((e) => { e.textContent = v; });
        const female = d.rows.filter((r) => r.sex === 'Female').length;
        set('[data-kpi="mice"]', d.rows.length);
        set('[data-kpi="regimens"]', d.summary.length);
        set('[data-kpi="sex"]', `${female} F / ${d.rows.length - female} M`);

        // Baseline-weight caveat, computed from the data
        const light = d.summary.filter((s) => ['Capomulin', 'Ramicane'].includes(s.regimen));
        const others = d.summary.filter((s) => !['Capomulin', 'Ramicane'].includes(s.regimen));
        const lo = Math.min(...others.map((s) => s.weight)), hi = Math.max(...others.map((s) => s.weight));
        set('[data-kpi="lightWeight"]', `${d.mean(light.map((s) => s.weight)).toFixed(1)} g`);
        set('[data-kpi="otherWeight"]', `${lo.toFixed(1)}–${hi.toFixed(1)} g`);

        let Chart;
        try { Chart = await ARC.loadChartJs(); } catch {
            document.querySelectorAll('.chart-box').forEach((b) => { b.innerHTML = '<div class="alert err">Charts couldn\'t load. The original figures are below.</div>'; });
            return;
        }
        const charts = [];
        const draw = () => {
            charts.splice(0).forEach((c) => c.destroy());
            const c = ARC.themeColors();
            const axes = (yTitle, xTitle) => ({
                x: { grid: { display: false }, ticks: { color: c.ink3 }, title: { display: !!xTitle, text: xTitle, color: c.ink3 } },
                y: { grid: { color: c.border }, ticks: { color: c.ink3 }, title: { display: !!yTitle, text: yTitle, color: c.ink3 }, beginAtZero: true }
            });
            const hl = (s, on, off) => (['Capomulin', 'Ramicane'].includes(s.regimen) ? on : off);

            charts.push(new Chart(document.getElementById('weightChart'), {
                type: 'bar',
                data: { labels: d.summary.map((s) => s.regimen), datasets: [{ label: 'Mean weight (g)', data: d.summary.map((s) => +s.weight.toFixed(1)), backgroundColor: d.summary.map((s) => hl(s, '#1e3a8a', 'rgba(10,108,255,.45)')), borderRadius: 6 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => `${x.raw} g mean baseline weight (n=${d.summary[x.dataIndex].n})` } } }, scales: axes('Mean weight (g)') }
            }));
            charts.push(new Chart(document.getElementById('countChart'), {
                type: 'bar',
                data: { labels: d.summary.map((s) => s.regimen), datasets: [
                    { label: 'Female', data: d.summary.map((s) => s.female), backgroundColor: 'rgba(234,88,12,.7)', borderRadius: 4 },
                    { label: 'Male', data: d.summary.map((s) => s.n - s.female), backgroundColor: 'rgba(10,108,255,.7)', borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: c.ink2, usePointStyle: true } } }, scales: { ...axes('Mice'), x: { ...axes().x, stacked: true }, y: { ...axes('Mice').y, stacked: true } } }
            }));
            const bins = Array.from({ length: 6 }, (_, i) => ({ lo: i * 4 + 1, hi: i * 4 + 4 }));
            charts.push(new Chart(document.getElementById('ageChart'), {
                type: 'bar',
                data: { labels: bins.map((b) => `${b.lo}–${b.hi}`), datasets: [{ label: 'Mice', data: bins.map((b) => d.rows.filter((r) => r.age >= b.lo && r.age <= b.hi).length), backgroundColor: 'rgba(10,108,255,.55)', borderRadius: 6 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: axes('Mice', 'Age (months)') }
            }));
        };
        document.addEventListener('themechange', draw);
        draw();
    }

    return { load, initOverview };
})();
