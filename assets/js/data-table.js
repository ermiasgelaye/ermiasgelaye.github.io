/* Reusable, dependency-free data table: CSV loading, search, filters, sorting, pagination, export.
 *
 *   DataTable.mount(rootEl, {
 *     csv: 'Resources/file.csv',          // or rows: [...]
 *     columns: [{ key, label, type: 'number'|'text'|'date', format(v,row), filter: true }],
 *     pageSize: 25, fileName: 'export'
 *   })
 */
'use strict';

const DataTable = (() => {
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

    /** Minimal RFC-4180 CSV parser (quoted fields, escaped quotes, CRLF). */
    function parseCSV(text) {
        const rows = []; let row = [], field = '', q = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (q) {
                if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
                else if (c === '"') q = false;
                else field += c;
            } else if (c === '"') q = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n' || c === '\r') {
                if (c === '\r' && text[i + 1] === '\n') i++;
                row.push(field); field = '';
                if (row.length > 1 || row[0] !== '') rows.push(row);
                row = [];
            } else field += c;
        }
        if (field !== '' || row.length) { row.push(field); rows.push(row); }
        const [head, ...body] = rows;
        return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i]])));
    }

    /** CSV text for a path: embedded copy (Resources/*.data.js) if present, else fetch. */
    async function getCSVText(path) {
        const name = String(path).split('/').pop();
        if (window.ARC_DATA && typeof window.ARC_DATA[name] === 'string') return window.ARC_DATA[name];
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
    }

    const toCSV = (cols, rows) => [cols.map((c) => c.label).join(','), ...rows.map((r) => cols.map((c) => {
        const v = String(r[c.key] ?? '');
        return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(','))].join('\n');

    function download(name, mime, text) {
        const url = URL.createObjectURL(new Blob([text], { type: mime }));
        const a = Object.assign(document.createElement('a'), { href: url, download: name });
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    async function mount(root, opts) {
        const cols = opts.columns;
        const state = { q: '', filters: {}, sortKey: null, sortDir: 1, page: 1, size: opts.pageSize || 25 };
        root.innerHTML = '<p class="dt-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading data…</p>';

        let data;
        try {
            data = opts.rows || parseCSV(await getCSVText(opts.csv));
        } catch {
            root.innerHTML = `<div class="alert err">The data couldn't be loaded. ${opts.csv ? `<a href="${esc(opts.csv)}">Download the CSV</a> instead.` : ''}</div>`;
            return null;
        }
        // Type conversion once
        data = data.map((r) => {
            const o = { ...r };
            cols.forEach((c) => { if (c.type === 'number' || c.type === 'date') o[c.key] = r[c.key] === '' || r[c.key] == null ? null : Number(r[c.key]); });
            return o;
        });

        const filterCols = cols.filter((c) => c.filter);
        root.innerHTML = `
            <div class="dt-toolbar">
                <div class="dt-search"><i class="fas fa-search" aria-hidden="true"></i>
                    <label class="visually-hidden" for="${opts.id}-q">Search table</label>
                    <input id="${opts.id}-q" class="input" type="search" placeholder="Search ${data.length.toLocaleString()} rows…" autocomplete="off"></div>
                ${filterCols.map((c) => `<label class="visually-hidden" for="${opts.id}-f-${c.key}">${esc(c.label)}</label>
                    <select id="${opts.id}-f-${c.key}" class="input dt-filter" data-key="${esc(c.key)}"><option value="">All ${esc(c.filterLabel || c.label)}</option>
                    ${[...new Set(data.map((r) => r[c.key]))].sort().map((v) => `<option>${esc(v)}</option>`).join('')}</select>`).join('')}
                <label class="visually-hidden" for="${opts.id}-size">Rows per page</label>
                <select id="${opts.id}-size" class="input dt-size">${[10, 25, 50, 100].map((n) => `<option value="${n}"${n === state.size ? ' selected' : ''}>${n} / page</option>`).join('')}</select>
            </div>
            <div class="dt-scroll" tabindex="0" aria-label="Data table (scrolls horizontally)">
                <table class="dt">
                    <caption class="visually-hidden">${esc(opts.caption || 'Data')}</caption>
                    <thead><tr>${cols.map((c) => `<th scope="col" class="${c.type === 'number' || c.type === 'date' ? 'num' : ''}"><button type="button" data-sort="${esc(c.key)}">${esc(c.label)} <i class="fas fa-sort" aria-hidden="true"></i></button></th>`).join('')}</tr></thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="dt-footer">
                <p class="dt-status" aria-live="polite"></p>
                <div class="dt-pager"></div>
                <div class="dt-export">
                    <button type="button" class="btn btn-outline btn-sm" data-export="csv"><i class="fas fa-file-csv" aria-hidden="true"></i> CSV</button>
                    <button type="button" class="btn btn-outline btn-sm" data-export="json"><i class="fas fa-file-code" aria-hidden="true"></i> JSON</button>
                    <button type="button" class="btn btn-outline btn-sm" data-export="print"><i class="fas fa-print" aria-hidden="true"></i> Print</button>
                </div>
            </div>`;

        const tbody = root.querySelector('tbody');
        const status = root.querySelector('.dt-status');
        const pager = root.querySelector('.dt-pager');

        const filtered = () => {
            const q = state.q.toLowerCase();
            let rows = data.filter((r) => Object.entries(state.filters).every(([k, v]) => !v || String(r[k]) === v)
                && (!q || cols.some((c) => String(c.format ? c.format(r[c.key], r) : r[c.key] ?? '').toLowerCase().includes(q))));
            if (state.sortKey) {
                const k = state.sortKey, d = state.sortDir;
                rows = [...rows].sort((a, b) => {
                    const x = a[k], y = b[k];
                    if (x == null) return 1; if (y == null) return -1;
                    return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * d;
                });
            }
            return rows;
        };

        function render() {
            const rows = filtered();
            const pages = Math.max(1, Math.ceil(rows.length / state.size));
            state.page = Math.min(state.page, pages);
            const start = (state.page - 1) * state.size;
            const view = rows.slice(start, start + state.size);
            tbody.innerHTML = view.length ? view.map((r) => `<tr>${cols.map((c) => `<td class="${c.type === 'number' || c.type === 'date' ? 'num' : ''}">${esc(c.format ? c.format(r[c.key], r) : r[c.key] ?? 'n/a')}</td>`).join('')}</tr>`).join('')
                : `<tr><td colspan="${cols.length}" class="dt-empty">No rows match your search.</td></tr>`;
            status.textContent = rows.length ? `Showing ${start + 1}–${start + view.length} of ${rows.length.toLocaleString()}${rows.length !== data.length ? ` (filtered from ${data.length.toLocaleString()})` : ''}` : 'No matching rows';
            const btn = (p, label, aria, disabled, current) => `<button type="button" class="dt-page${current ? ' current' : ''}" data-page="${p}" aria-label="${aria}"${disabled ? ' disabled' : ''}${current ? ' aria-current="page"' : ''}>${label}</button>`;
            const near = [...new Set([1, state.page - 1, state.page, state.page + 1, pages])].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
            pager.innerHTML = btn(state.page - 1, '<i class="fas fa-chevron-left" aria-hidden="true"></i>', 'Previous page', state.page === 1)
                + near.map((p, i) => (i && p - near[i - 1] > 1 ? '<span class="dt-gap">…</span>' : '') + btn(p, p, `Page ${p}`, false, p === state.page)).join('')
                + btn(state.page + 1, '<i class="fas fa-chevron-right" aria-hidden="true"></i>', 'Next page', state.page === pages);
            root.querySelectorAll('th button').forEach((b) => {
                const on = b.dataset.sort === state.sortKey;
                b.closest('th').setAttribute('aria-sort', on ? (state.sortDir > 0 ? 'ascending' : 'descending') : 'none');
                b.querySelector('i').className = `fas ${on ? (state.sortDir > 0 ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`;
            });
            opts.onChange?.(rows);
        }

        let t;
        root.querySelector('.dt-search input').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); state.page = 1; render(); }, 150); });
        root.querySelectorAll('.dt-filter').forEach((s) => s.addEventListener('change', () => { state.filters[s.dataset.key] = s.value; state.page = 1; render(); }));
        root.querySelector('.dt-size').addEventListener('change', (e) => { state.size = +e.target.value; state.page = 1; render(); });
        root.querySelector('thead').addEventListener('click', (e) => {
            const b = e.target.closest('[data-sort]'); if (!b) return;
            if (state.sortKey === b.dataset.sort) state.sortDir *= -1; else { state.sortKey = b.dataset.sort; state.sortDir = 1; }
            render();
        });
        pager.addEventListener('click', (e) => { const b = e.target.closest('[data-page]'); if (!b || b.disabled) return; state.page = +b.dataset.page; render(); root.querySelector('.dt-scroll').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
        root.querySelector('.dt-export').addEventListener('click', (e) => {
            const kind = e.target.closest('[data-export]')?.dataset.export; if (!kind) return;
            const rows = filtered();
            if (kind === 'csv') download(`${opts.fileName || 'data'}.csv`, 'text/csv', toCSV(cols, rows));
            if (kind === 'json') download(`${opts.fileName || 'data'}.json`, 'application/json', JSON.stringify(rows.map((r) => Object.fromEntries(cols.map((c) => [c.key, r[c.key]]))), null, 2));
            if (kind === 'print') { const prev = state.size; state.size = rows.length || 1; state.page = 1; render(); window.print(); state.size = prev; render(); }
        });

        render();
        return { data, filtered, parseCSV };
    }

    return { mount, parseCSV, getCSVText };
})();
