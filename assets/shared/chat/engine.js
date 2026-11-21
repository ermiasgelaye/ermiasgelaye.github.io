/* ARC Photo Assistant — retrieval engine.
 *
 * Knowledge architecture
 *   ARC.KB is an array of entries registered by files in chat/knowledge/*.js:
 *     { id, topic, title, level?, q: [example questions], k: [keywords/phrases],
 *       a: 'answer (light markdown)', more?: 'deeper follow-up answer',
 *       related?: [entry ids], actions?: [{ label, action }] }
 *   Add knowledge by adding entries — the index is rebuilt automatically.
 *
 * Answering pipeline (first match wins)
 *   1. Small-talk / meta intents (greetings, thanks, help)
 *   2. Follow-ups using conversation context ("tell me more", "what about at night?")
 *   3. Tools that compute real answers (portfolio search & stats, 500 rule, hyperfocal,
 *      ND filter time, unit conversion, arithmetic, date/time)
 *   4. Ranked retrieval over the knowledge base (field-weighted BM25 + synonyms + typo tolerance)
 *   5. If confidence is low: optional remote AI (server-side, grounded with KB excerpts) or an
 *      honest "I don't know" with the nearest topics. Nothing is invented.
 *
 * Works in the browser (window.ARC) and in Node for tests (module.exports). */
'use strict';

(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];

    /* ==================== Text processing ==================== */

    const STOP = new Set(('a an the and or but if then so of to in on at for from by with without about into over under is are was were be been being ' +
        'do does did doing have has had having i me my mine we our you your yours he she it its they them their this that these those ' +
        'what which who whom whose when where why how can could should would will shall may might must please tell know want need like ' +
        'just really very much many some any more most also too there here get got make makes made give show let lets im ive id dont ' +
        'thanks thank hi hello hey ok okay yes no not use using used best good better way ways thing things kind sort able ' +
        'explain describe mean means meaning define definition tip tips advice idea ideas guide basics basic ' +
        'photo photos photograph photographs photography picture pictures pic pics image images shot shots take taking').split(/\s+/));

    // Per-site tuning (ARC.config.ASSISTANT): words that are filler on one site can be meaningful on another,
    // and questions about the site's subject ("is he good at…") should favour that subject's entries.
    const SITE_CFG = (ARC.config && ARC.config.ASSISTANT) || {};
    (SITE_CFG.keepWords || []).forEach((w) => STOP.delete(w));

    // Multi-word phrases and synonyms mapped to canonical terms (applied before tokenising).
    const PHRASES = [
        [/\bf[\s\-/]?stops?\b|\bf[\s\-]?numbers?\b|\bf\/\d+(\.\d+)?\b/g, ' aperture '],
        [/\bshutter[\s-]?speeds?\b|\bexposure times?\b/g, ' shutterspeed '],
        [/\bdepth[\s-]of[\s-]field\b|\bdof\b/g, ' depthoffield '],
        [/\bblurr?(y|ed)? backgrounds?\b|\bbackground blur\b|\bblur the background\b/g, ' bokeh depthoffield '],
        [/\bwhite[\s-]?balance\b|\bcolou?r temperature\b|\bkelvin\b/g, ' whitebalance '],
        [/\bgolden[\s-]?hour\b|\bmagic hour\b/g, ' goldenhour '],
        [/\bblue[\s-]?hour\b/g, ' bluehour '],
        [/\brule of thirds\b|\bthirds grid\b/g, ' ruleofthirds '],
        [/\bleading[\s-]lines?\b/g, ' leadinglines '],
        [/\blong[\s-]exposures?\b|\bslow shutter\b|\bsilky water\b|\bsmooth water\b/g, ' longexposure '],
        [/\bneutral density\b|\bnd[\s-]?filters?\b|\bnd\d+\b/g, ' ndfilter '],
        [/\bpolari[sz](er|ing|ed)?( filters?)?\b|\bcpl\b|\bcircular polari[sz]er\b/g, ' polarizer '],
        [/\bmilky[\s-]way\b|\bstars?\b|\bnight sky\b|\bastro(photography)?\b/g, ' astro '],
        [/\bnorthern lights\b|\baurora( borealis)?\b/g, ' aurora '],
        [/\bfull[\s-]?frame\b/g, ' fullframe '],
        [/\baps[\s-]?c\b|\bcrop(ped)?[\s-]sensor\b/g, ' apsc '],
        [/\bmicro four thirds\b|\bm4\/3\b|\bmft\b|\bm43\b/g, ' microfourthirds '],
        [/\bcrop factor\b/g, ' cropfactor '],
        [/\bsensor sizes?\b/g, ' sensorsize '],
        [/\bimage stabili[sz]ation\b|\bibis\b|\bvibration reduction\b|\bvr\b|\boptical stabili[sz]ation\b|\bois\b/g, ' stabilization '],
        [/\bauto[\s-]?focus\b|\baf[\s-]?(c|s|mode|area)?\b/g, ' autofocus '],
        [/\bback[\s-]button focus\b/g, ' backbutton autofocus '],
        [/\bmanual focus\b/g, ' manualfocus '],
        [/\bfocus stack(ing|ed)?\b/g, ' focusstacking '],
        [/\bhyper[\s-]?focal\b/g, ' hyperfocal '],
        [/\bhigh dynamic range\b|\bhdr\b/g, ' hdr '],
        [/\bdynamic range\b/g, ' dynamicrange '],
        [/\bbracket(ing|ed)?\b|\baeb\b/g, ' bracketing '],
        [/\bexposure (triangle|basics)\b/g, ' exposuretriangle '],
        [/\bexposure compensation\b|\bev comp\b/g, ' exposurecompensation '],
        [/\baperture priority\b|\bav mode\b|\ba mode\b/g, ' aperturepriority '],
        [/\bshutter priority\b|\btv mode\b|\bs mode\b/g, ' shutterpriority '],
        [/\bmanual mode\b|\bm mode\b/g, ' manualmode '],
        [/\bauto iso\b/g, ' autoiso '],
        [/\bmetering modes?\b|\blight meter(ing)?\b/g, ' metering '],
        [/\braw (vs|versus|or) jpe?g\b|\bjpe?g (vs|versus|or) raw\b|\braw files?\b|\bshoot(ing)? raw\b/g, ' raw jpeg '],
        [/\bnoise reduction\b|\bdenoise\b|\bgrainy\b|\bgrain\b/g, ' noise '],
        [/\bcolou?r grading\b|\bcolou?r correction\b/g, ' colorgrading '],
        [/\badobe lightroom\b|\blightroom( classic)?\b|\blr\b|\blrc\b/g, ' lightroom '],
        [/\bphotoshop\b|\bps\b/g, ' photoshop '],
        [/\bcolou?r spaces?\b|\bsrgb\b|\badobe ?rgb\b|\bprophoto\b|\bdisplay p3\b/g, ' colorspace '],
        [/\bcalibrat(e|ion|ing)( my)? (monitor|screen|display)\b|\bmonitor calibration\b/g, ' calibration '],
        [/\bprint(s|ing)? sizes?\b|\bdpi\b|\bppi\b/g, ' printsize resolution '],
        [/\bmemory cards?\b|\bsd cards?\b|\bcfexpress\b/g, ' memorycard '],
        [/\bback ?ups?\b|\bbacking up\b|\b3-2-1\b/g, ' backup '],
        [/\bsensor clean(ing)?\b|\bdust spots?\b|\bclean (my|the) (sensor|lens)\b/g, ' sensorcleaning '],
        [/\bmirrorless\b/g, ' mirrorless '],
        [/\bdslr\b|\bslr\b/g, ' dslr '],
        [/\bprime lens(es)?\b|\bfixed focal\b/g, ' primelens '],
        [/\bzoom lens(es)?\b/g, ' zoomlens '],
        [/\bwide[\s-]?angle\b|\bultra[\s-]?wide\b/g, ' wideangle '],
        [/\btele[\s-]?photo\b|\bsuper[\s-]?tele\b|\blong lens\b/g, ' telephoto '],
        [/\bmacro lens\b|\bclose[\s-]?ups?\b/g, ' macro '],
        [/\bnifty fifty\b|\b50 ?mm\b/g, ' fiftymm primelens '],
        [/\bfocal lengths?\b|\b\d{2,3} ?mm\b/g, ' focallength '],
        [/\bphone camera\b|\biphone\b|\bandroid\b|\bsmartphone\b|\bmobile photography\b|\bpixel phone\b|\bgalaxy phone\b/g, ' smartphone '],
        [/\bdrones?\b|\bdji\b|\baerial photography\b|\buav\b|\brpas\b/g, ' drone '],
        [/\bin flight\b|\bbirds? in flight\b|\bbif\b/g, ' birdsinflight '],
        [/\bmotion blur\b|\bpanning\b/g, ' motionblur panning '],
        [/\bcamera shake\b|\bshaky\b/g, ' camerashake '],
        [/\bblurr?y (photos?|pictures?|images?|shots?)\b|\bnot sharp\b|\bout of focus\b|\bsoft (photos?|images?)\b/g, ' blurry sharpness '],
        [/\bover[\s-]?exposed\b|\btoo bright\b|\bblown (out )?highlights?\b/g, ' overexposed '],
        [/\bunder[\s-]?exposed\b|\btoo dark\b/g, ' underexposed '],
        [/\bsunny 16\b/g, ' sunny16 '],
        [/\bexpose to the right\b|\bettr\b/g, ' ettr '],
        [/\bchromatic aberration\b|\bpurple fringing\b|\bcolou?r fringing\b/g, ' chromaticaberration '],
        [/\blens flare\b|\bsun ?stars?\b|\bstarbursts?\b/g, ' flare sunstar '],
        [/\bfill flash\b|\bspeedlights?\b|\bspeedlites?\b|\bstrobes?\b|\boff[\s-]camera flash\b/g, ' flash '],
        [/\bhow (do|can) i (buy|purchase|order)\b|\bbuy (a )?prints?\b|\bpurchase prints?\b/g, ' purchase prints '],
        [/\bunlimited (access|downloads?|plan|licen[cs]e)\b|\bpremium\b|\bsubscription\b/g, ' unlimited '],
        [/\bfree downloads?\b|\bdownload limit\b/g, ' download free '],
        [/\bcommercial (use|licen[cs]e|usage)\b|\buse (your|the|these) photos?\b|\blicen[cs]ing\b/g, ' license '],
        [/\bcopyright(ed)?\b/g, ' copyright '],
        [/\brefunds?\b|\bmoney[\s-]?back\b/g, ' refund '],
        [/\bwho (is|are) (you|the photographer|ermias)\b|\babout (the )?(photographer|ermias)\b|\bermias\b/g, ' photographer about '],
        [/\bget in touch\b|\bcontact (you|him|ermias)\b|\bemail (you|him)\b|\breach (you|him)\b/g, ' contact '],
        [/\bworkshops?\b|\bclasses\b|\blessons?\b|\bmentor(ing|ship)?\b|\btutoring\b/g, ' workshop '],
        [/\bcommissions?\b|\bhire (you|him)\b|\bbook (a )?(shoot|session)\b|\bphoto shoot\b/g, ' commission '],
        [/\bbutchart( gardens)?\b/g, ' butchart '],
        // --- data science & career vocabulary ---
        [/\bmachine[\s-]learning\b|\bml\b/g, ' machinelearning '],
        [/\bdeep[\s-]learning\b|\bneural (net|network)s?\b/g, ' deeplearning '],
        [/\bartificial intelligence\b|\bai\b/g, ' ai '],
        [/\bnatural language processing\b|\bnlp\b/g, ' nlp '],
        [/\bdata[\s-]vi[sz](uali[sz]ation)?\b|\bdataviz\b/g, ' dataviz '],
        [/\bexploratory data analysis\b|\beda\b/g, ' eda '],
        [/\bdata (wrangling|cleaning|munging|prep(aration)?)\b/g, ' datacleaning '],
        [/\bfeature engineering\b/g, ' featureengineering '],
        [/\bcross[\s-]?validation\b|\bk[\s-]?fold\b/g, ' crossvalidation '],
        [/\bover[\s-]?fit(ting)?\b|\bunder[\s-]?fit(ting)?\b|\bbias[\s-]variance\b/g, ' overfitting '],
        [/\bp[\s-]?values?\b/g, ' pvalue '],
        [/\bhypothesis test(ing|s)?\b|\bt[\s-]?tests?\b|\bchi[\s-]square\b/g, ' hypothesistesting '],
        [/\ba\/b test(ing|s)?\b|\bab test(ing|s)?\b|\bsplit test(ing)?\b/g, ' abtesting '],
        [/\bconfusion matrix\b|\bprecision\b|\brecall\b|\bf1( score)?\b|\broc\b|\bauc\b/g, ' classificationmetrics '],
        [/\brandom forests?\b|\bdecision trees?\b|\bgradient boost(ing)?\b|\bxgboost\b/g, ' treemodels '],
        [/\blinear regression\b|\blogistic regression\b/g, ' regression '],
        [/\bk[\s-]?means\b|\bclustering\b/g, ' clustering '],
        [/\bprincipal component analysis\b|\bpca\b|\bdimensionality reduction\b/g, ' pca '],
        [/\btime[\s-]series\b|\bforecast(ing)?\b/g, ' timeseries '],
        [/\bwindow functions?\b/g, ' windowfunction sql '],
        [/\bpower bi\b/g, ' powerbi '],
        [/\bresumes?\b|\bcv\b|\bcurriculum vitae\b/g, ' resume '],
        [/\bwork experience\b|\bjob history\b|\bemployment\b/g, ' experience '],
        [/\bniagara( falls)?\b/g, ' niagara '],
        [/\bbanff\b|\blake louise\b|\bjasper\b|\brockies\b|\brocky mountains\b/g, ' rockies '],
        [/\bprince edward island\b|\bpei\b/g, ' pei '],
        [/\bvancouver island\b|\bvictoria bc\b/g, ' vancouverisland ']
    ];

    const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

    function normalize(text, { phrases = true } = {}) {
        let s = ' ' + stripAccents(String(text).toLowerCase()).replace(/[’‘`]/g, "'") + ' ';
        if (phrases) for (const [re, rep] of PHRASES) s = s.replace(re, rep);
        return s.replace(/'s\b/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // Conservative stemmer: enough to merge plurals and common verb forms.
    function stem(w) {
        if (w.length <= 4) return w;
        const rules = [['ies', 'y'], ['sses', 'ss'], ['ing', ''], ['edly', ''], ['ed', ''], ['ers', 'er'], ['es', 'e'], ['s', '']];
        for (const [suf, rep] of rules) {
            if (w.endsWith(suf) && w.length - suf.length >= 3) {
                if (suf === 's' && (w.endsWith('ss') || w.endsWith('us') || w.endsWith('is'))) continue;
                let out = w.slice(0, -suf.length) + rep;
                if ((suf === 'ing' || suf === 'ed') && /([b-df-hj-np-tv-z])\1$/.test(out) && !/(ll|ss|ff|zz)$/.test(out)) out = out.slice(0, -1);
                return out;
            }
        }
        return w;
    }

    const tokenize = (text, keepStop = false, opts) => normalize(text, opts).split(' ')
        .filter((t) => t.length > 1 && (keepStop || !STOP.has(t))).map(stem).filter((t) => keepStop || !STOP.has(t));

    function editDistance(a, b, max) {
        if (Math.abs(a.length - b.length) > max) return max + 1;
        const prev = new Array(b.length + 1);
        for (let j = 0; j <= b.length; j++) prev[j] = j;
        for (let i = 1; i <= a.length; i++) {
            let cur = [i], rowMin = i;
            for (let j = 1; j <= b.length; j++) {
                const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                cur.push(v);
                if (v < rowMin) rowMin = v;
            }
            if (rowMin > max) return max + 1;
            for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
        }
        return prev[b.length];
    }

    /* ==================== Index ==================== */

    const FIELD_WEIGHT = { title: 3, k: 3.2, q: 2.2, a: 0.45 };
    let index = null;

    function buildIndex() {
        const docs = ARC.KB.map((e) => {
            const tf = new Map();
            const add = (text, w) => {
                const main = tokenize(text);
                main.forEach((t) => tf.set(t, (tf.get(t) || 0) + w));
                // plain words (no phrase merging) at lower weight: lets "balance" match "white balance"
                const seen = new Set(main);
                tokenize(text, false, { phrases: false }).forEach((t) => { if (!seen.has(t)) tf.set(t, (tf.get(t) || 0) + w * 0.4); });
            };
            add(e.title, FIELD_WEIGHT.title);
            (e.k || []).forEach((k) => add(k, FIELD_WEIGHT.k));
            (e.q || []).forEach((q) => add(q, FIELD_WEIGHT.q));
            add(e.a || '', FIELD_WEIGHT.a);
            let len = 0;
            tf.forEach((v) => { len += v; });
            const phrases = (e.k || []).map((k) => normalize(k)).filter((k) => k.includes(' ') || k.length > 3);
            return { e, tf, len, phrases };
        });
        const df = new Map();
        docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
        const N = docs.length || 1;
        const idf = new Map();
        df.forEach((n, t) => idf.set(t, Math.log(1 + (N - n + 0.5) / (n + 0.5))));
        const avgLen = docs.reduce((s, d) => s + d.len, 0) / N;
        const vocab = [...df.keys()];
        const byId = new Map(ARC.KB.map((e) => [e.id, e]));
        index = { docs, idf, avgLen, vocab, byId, size: ARC.KB.length };
        return index;
    }
    const getIndex = () => (index && index.size === ARC.KB.length ? index : buildIndex());

    function expandTypos(tokens) {
        const { idf, vocab } = getIndex();
        const out = [];
        tokens.forEach((t) => {
            if (idf.has(t) || /^\d+$/.test(t)) { out.push([t, 1]); return; }
            if (t.length < 5) return;
            const max = t.length >= 9 ? 2 : 1;
            let best = null, bestD = max + 1;
            for (const v of vocab) {
                if (Math.abs(v.length - t.length) > max || v[0] !== t[0] || v[1] !== t[1]) continue;
                const d = editDistance(t, v, max);
                if (d < bestD) { bestD = d; best = v; if (d === 1 && max === 1) break; }
            }
            if (best) out.push([best, 0.75, true]);
        });
        return out;
    }

    function rank(query, { boostTokens = [], limit = 5 } = {}) {
        const ix = getIndex();
        const rawTokens = tokenize(query);
        const qTokens = expandTypos(rawTokens);
        boostTokens.forEach((t) => qTokens.push([t, 0.35]));
        if (!qTokens.length) return [];
        // Coverage is measured against *all* words in the question, including unknown ones.
        const totalWeight = rawTokens.length + boostTokens.length * 0.35;
        const nq = ' ' + normalize(query) + ' ';
        const k1 = 1.2, b = 0.6;
        const results = [];
        for (const d of ix.docs) {
            let score = 0, matched = 0, exact = 0;
            for (const [t, w, fuzzy] of qTokens) {
                const f = d.tf.get(t);
                if (!f) continue;
                matched += w;
                if (!fuzzy && w >= 1) exact += 1;
                const idf = ix.idf.get(t) || 0;
                score += w * idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / ix.avgLen));
            }
            if (!score) continue;
            for (const p of d.phrases) if (nq.includes(` ${p} `)) score += p.includes(' ') ? 2.5 : 1.2;
            const coverage = matched / Math.max(totalWeight, 1e-9);
            results.push({ entry: d.e, score: score * (0.55 + 0.45 * coverage), coverage, exact });
        }
        results.sort((a, b2) => b2.score - a.score);
        return results.slice(0, limit);
    }

    /* ==================== Tools (computed answers) ==================== */

    const num = (s) => parseFloat(String(s).replace(',', '.'));
    const fmtTime = (sec) => {
        if (sec < 1) return `1/${Math.round(1 / sec)} s`;
        if (sec < 60) return `${+sec.toFixed(1)} s`;
        const m = Math.floor(sec / 60), s = Math.round(sec % 60);
        return s ? `${m} min ${s} s` : `${m} min`;
    };
    const cropOf = (s) => {
        if (/micro ?four ?thirds|\bm4\/3\b|\bmft\b|\bm43\b|microfourthirds/.test(s)) return [2, 'Micro Four Thirds (2×)'];
        if (/canon.*(aps|crop)|(aps|crop).*canon|1\.6/.test(s)) return [1.6, 'Canon APS-C (1.6×)'];
        if (/aps[\s-]?c|crop|apsc|1\.5/.test(s)) return [1.5, 'APS-C (1.5×)'];
        return [1, 'full frame'];
    };

    function parseShutter(s) {
        let m = s.match(/\b1\s*\/\s*(\d{1,5})\b(?!\s*(?:mm|stop))/);
        if (m) return 1 / num(m[1]);
        m = s.match(/\b(\d+(?:[.,]\d+)?)\s*(?:s|sec|secs|seconds?)\b/);
        if (m) return num(m[1]);
        return null;
    }

    const TOOLS = [
        {
            id: 'tool-500rule',
            test: (s) => /\b(500|npf)\s*rule\b|max(imum)? shutter.*(star|astro|milky)|(star|astro|milky).*(max(imum)?|longest) (shutter|exposure)|star trail/.test(s),
            run(s) {
                const fm = s.match(/(\d{1,3})\s*mm/);
                if (!fm) return { text: 'Tell me your **focal length** (and sensor size if not full frame), e.g. “500 rule for 14mm on APS-C”, and I\'ll work out the longest shutter speed before stars start to trail.', related: ['astro-milkyway'] };
                const f = num(fm[1]);
                const [crop, cname] = cropOf(s);
                const t500 = 500 / (f * crop);
                const t300 = 300 / (f * crop);
                return {
                    text: `For **${f}mm** on **${cname}** (equivalent ${Math.round(f * crop)}mm):\n\n` +
                        `- **500 rule:** about **${fmtTime(t500)}** — fine for small web images.\n` +
                        `- **Stricter “300 rule”** (better for modern high-resolution sensors or large prints): about **${fmtTime(t300)}**.\n\n` +
                        `Both are rules of thumb. The more precise **NPF rule** also factors in aperture and pixel pitch, and usually gives a shorter time than the 500 rule. Zoom in on a test frame and shorten the exposure if stars look like short dashes.`,
                    related: ['astro-milkyway', 'astro-settings']
                };
            }
        },
        {
            id: 'tool-hyperfocal',
            test: (s) => /hyper ?focal/.test(s) && /\d{1,3}\s*mm/.test(s),
            run(s) {
                const f = num(s.match(/(\d{1,3})\s*mm/)[1]);
                const am = s.match(/\bf\s*\/?\s*(\d{1,2}(?:[.,]\d)?)\b/);
                if (!am) return { text: `I also need the **aperture**, e.g. “hyperfocal distance 24mm f/8”.`, related: ['hyperfocal'] };
                const N = num(am[1]);
                const [crop, cname] = cropOf(s);
                const c = 0.03 / crop; // circle of confusion in mm
                const H = (f * f) / (N * c) + f; // mm
                const m = H / 1000;
                return {
                    text: `**Hyperfocal distance for ${f}mm at f/${N} (${cname}):** about **${m.toFixed(m < 10 ? 2 : 1)} m** (${(m * 3.281).toFixed(1)} ft).\n\n` +
                        `Focus at that distance and everything from roughly **${(m / 2).toFixed(m < 10 ? 2 : 1)} m** to infinity will be acceptably sharp.\n\n` +
                        `_Calculated with H = f²/(N·c) + f, using a circle of confusion of ${c.toFixed(3)} mm (standard for ${cname}). For big prints, focus a little beyond this distance for a safety margin._`,
                    related: ['hyperfocal', 'depth-of-field']
                };
            }
        },
        {
            id: 'tool-nd',
            test: (s) => /(\d{1,2})\s*[- ]?stops?\b/.test(s) && (/nd|neutral|filter|ndfilter/.test(s)) && parseShutter(s) !== null,
            run(s) {
                const stops = num(s.match(/(\d{1,2})\s*[- ]?stops?\b/)[1]);
                const base = parseShutter(s);
                const t = base * Math.pow(2, stops);
                return {
                    text: `With a **${stops}-stop ND filter**, a base exposure of **${fmtTime(base)}** becomes about **${fmtTime(t)}** (×${Math.pow(2, stops).toLocaleString()}).\n\n` +
                        `Tips: compose and focus *before* screwing on a dark filter, switch to manual focus, use a tripod and a remote/2-second timer, and cover the viewfinder on DSLRs to stop light leaks.${t > 30 ? ' Exposures over 30 s need **Bulb** mode (or your camera\'s extended shutter setting).' : ''}`,
                    related: ['nd-filters', 'long-exposure']
                };
            }
        },
        {
            id: 'tool-stops',
            test: (s) => /equivalent exposure|how many stops|stops? (between|from)/.test(s) && /f\s*\/?\s*\d/.test(s),
            run(s) {
                const fs = [...s.matchAll(/\bf\s*\/?\s*(\d{1,2}(?:[.,]\d)?)\b/g)].map((m) => num(m[1]));
                if (fs.length < 2) return null;
                const stops = 2 * Math.log2(fs[1] / fs[0]);
                return {
                    text: `From **f/${fs[0]}** to **f/${fs[1]}** is **${Math.abs(stops).toFixed(1)} stops** ${stops > 0 ? 'less' : 'more'} light. To keep the same exposure, ${stops > 0 ? 'lengthen your shutter speed' : 'shorten your shutter speed'} by ×${Math.pow(2, Math.abs(stops)).toFixed(1)} (or change ISO by the same number of stops).`,
                    related: ['exposure-triangle', 'aperture']
                };
            }
        },
        {
            id: 'tool-convert',
            test: (s) => /(-?\d+(?:[.,]\d+)?)\s*(°|deg(rees)?\s*)?(c|f|celsius|fahrenheit|km|kilometers?|kilometres?|miles?|mi|cm|centimeters?|centimetres?|inch(es)?|in|m|meters?|metres?|feet|ft|kg|kilograms?|lbs?|pounds?)\s+(to|in|into)\s+(°?[cf]|celsius|fahrenheit|km|kilomet\w*|miles?|mi|cm|centimet\w*|inch(es)?|in|m|met\w*|feet|ft|kg|kilograms?|lbs?|pounds?)\b/.test(s),
            run(s) {
                const m = s.match(/(-?\d+(?:[.,]\d+)?)\s*(?:°|deg(?:rees)?\s*)?(c|f|celsius|fahrenheit|km|kilometers?|kilometres?|miles?|mi|cm|centimeters?|centimetres?|inch(?:es)?|in|m|meters?|metres?|feet|ft|kg|kilograms?|lbs?|pounds?)\b/);
                if (!m) return null;
                const v = num(m[1]);
                const u = m[2];
                const r = (x, d = 2) => +x.toFixed(d);
                let out;
                if (/^(c|celsius)$/.test(u)) out = `${v} °C = **${r(v * 9 / 5 + 32, 1)} °F**`;
                else if (/^(f|fahrenheit)$/.test(u)) out = `${v} °F = **${r((v - 32) * 5 / 9, 1)} °C**`;
                else if (/^(km|kilomet)/.test(u)) out = `${v} km = **${r(v * 0.621371)} miles**`;
                else if (/^(mi|mile)/.test(u)) out = `${v} miles = **${r(v * 1.609344)} km**`;
                else if (/^(cm|centimet)/.test(u)) out = `${v} cm = **${r(v / 2.54)} inches**`;
                else if (/^(in|inch)/.test(u)) out = `${v} inches = **${r(v * 2.54)} cm**`;
                else if (/^(m|meter|metre)/.test(u)) out = `${v} m = **${r(v * 3.28084)} ft**`;
                else if (/^(ft|feet)/.test(u)) out = `${v} ft = **${r(v / 3.28084)} m**`;
                else if (/^(kg|kilogram)/.test(u)) out = `${v} kg = **${r(v * 2.20462)} lb**`;
                else if (/^(lb|pound)/.test(u)) out = `${v} lb = **${r(v / 2.20462)} kg**`;
                return out ? { text: out } : null;
            }
        },
        {
            id: 'tool-print',
            test: (s) => /(how big|largest|max(imum)?).*(print)|print.*(how big|size).*(\d+\s*(mp|megapixel))|(\d+\s*(mp|megapixel)).*print/.test(s),
            run(s) {
                const mp = s.match(/(\d{1,3}(?:[.,]\d)?)\s*(mp|megapixels?)/);
                if (!mp) return { text: 'Tell me the camera resolution, e.g. “how big can I print 24MP?”, and I\'ll calculate print sizes at 300 and 200 PPI.', related: ['print-resolution'] };
                const px = num(mp[1]) * 1e6;
                const w = Math.sqrt(px * 1.5), h = w / 1.5; // 3:2 sensor
                const at = (ppi) => `${(w / ppi).toFixed(1)} × ${(h / ppi).toFixed(1)} in (${(w / ppi * 2.54).toFixed(0)} × ${(h / ppi * 2.54).toFixed(0)} cm)`;
                return {
                    text: `A **${mp[1]} MP** 3:2 image is about **${Math.round(w)} × ${Math.round(h)} px**.\n\n- **300 PPI** (close-viewing, gallery quality): ${at(300)}\n- **200 PPI** (very good for most wall prints): ${at(200)}\n- **150 PPI** (large prints viewed from a distance): ${at(150)}\n\nViewing distance matters more than raw PPI — large canvases are rarely viewed up close.`,
                    related: ['print-resolution']
                };
            }
        },
        {
            id: 'tool-math',
            test: (s) => /^(what is|whats|calculate|compute|solve)?\s*[-+*/x×÷^().\d\s%]+[=?]?$/.test(s.replace(/what's/, 'whats')) && /\d\s*[-+*/x×÷^%]\s*[\d(]/.test(s),
            run(s) {
                const expr = s.replace(/^(what is|whats|what's|calculate|compute|solve)\s*/, '').replace(/[=?]/g, '').replace(/[x×]/g, '*').replace(/÷/g, '/');
                const v = safeEval(expr);
                return v === null ? null : { text: `${expr.trim()} = **${+v.toFixed(10)}**` };
            }
        },
        {
            id: 'tool-live-data',
            test: (s) => /\b(weather|forecast|temperature)\b.*\b(today|tomorrow|tonight|this week|weekend|now|in [a-z]+)\b|\b(latest|today'?s|breaking) news\b|\bstock price\b|\bexchange rate\b|\b(bitcoin|crypto) price\b|\bscore of the\b/.test(s),
            run(s) {
                const wx = /weather|forecast|temperature/.test(s);
                return {
                    text: wx
                        ? "I don't have access to live weather data, so I can't give you a forecast. For planning shoots, check your local weather service, and for night photography a sky-clarity forecast such as **Clear Outside**; for sunrise/sunset light, apps like **PhotoPills** or **The Photographer's Ephemeris** help."
                        : "I don't have access to live or real-time information (news, prices, scores), so I can't answer that reliably. A current news or search service is the best source.",
                    related: wx ? ['golden-hour', 'overcast-weather'] : []
                };
            }
        },
        {
            id: 'tool-time',
            test: (s) => /\b(what time is it|current time|what is the time|today'?s date|what (is the )?date|what day is it)\b/.test(s),
            run() {
                const d = new Date();
                return { text: `It's **${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}** on **${d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}** (your device's local time).` };
            }
        }
    ];

    // Tiny arithmetic parser (no eval): + - * / % ^ and parentheses.
    function safeEval(src) {
        const t = src.match(/\d+(?:\.\d+)?|[-+*/%^()]/g);
        if (!t || t.join('') !== src.replace(/\s+/g, '')) return null;
        let i = 0;
        const peek = () => t[i], next = () => t[i++];
        const factor = () => {
            let tk = next();
            if (tk === '-') return -factor();
            if (tk === '+') return factor();
            if (tk === '(') { const v = expr(); if (next() !== ')') throw 0; return v; }
            const v = parseFloat(tk);
            if (Number.isNaN(v)) throw 0;
            return v;
        };
        const power = () => { const b = factor(); if (peek() === '^') { next(); return Math.pow(b, power()); } return b; };
        const term = () => { let v = power(); while (['*', '/', '%'].includes(peek())) { const op = next(), r = power(); v = op === '*' ? v * r : op === '/' ? v / r : v % r; } return v; };
        const expr = () => { let v = term(); while (['+', '-'].includes(peek())) { const op = next(), r = term(); v = op === '+' ? v + r : v - r; } return v; };
        try { const v = expr(); return i === t.length && Number.isFinite(v) ? v : null; } catch { return null; }
    }

    /* ==================== Portfolio tools (use gallery data) ==================== */

    const PHOTO_WORDS = /\b(photos?|pictures?|pics?|images?|shots?|photographs?|gallery|portfolio)\b/;
    const SHOW_INTENT = /\b(show|find|see|view|display|search|look(ing)? for|browse|open|any|have|got|do you have|is there|are there)\b/;

    function portfolioTool(raw, s) {
        const P = ARC.portfolio;
        if (!P) return null;

        if (/\bhow many\b.*\b(photos?|pictures?|images?)\b|\b(size of|total)\b.*\b(gallery|portfolio|collection)\b|\bcategories\b.*\b(are there|available|do you have)\b|\bwhat categories\b/.test(s)) {
            const c = P.counts();
            const lines = Object.entries(P.categories).map(([k, v]) => `- **${v.name}** — ${c[k] || 0} photos (${v.description.toLowerCase()})`).join('\n');
            return {
                text: `The portfolio currently has **${c.all.toLocaleString()} photographs** in ${Object.keys(P.categories).length} categories:\n\n${lines}\n\nMost were taken across Canada (Ontario, British Columbia, Québec, Alberta, the Maritimes), plus a few from Italy, Vatican City and Dubai.`,
                actions: Object.keys(P.categories).slice(0, 6).map((k) => ({ label: P.categories[k].name, action: `gallery:category:${k}` })),
                id: 'portfolio-stats'
            };
        }

        if (/\b(where|which (places|locations|countries|provinces)|what (places|locations|countries))\b.*\b(taken|shot|photograph|travell?ed|travel|been|visit(ed)?|photos?)\b|\b(travel )?map\b/.test(s)) {
            const locs = P.topLocations(12);
            return {
                text: `Photos in the portfolio come from **${P.locationCount()} distinct places**. The most featured:\n\n${locs.map(([l, n]) => `- ${l} — ${n}`).join('\n')}\n\nThe **travel map** shows them all — or ask me for something specific, like “show me photos of Niagara Falls”.`,
                actions: [{ label: 'Open the travel map', action: 'scroll:#travel-map' }],
                id: 'portfolio-locations'
            };
        }

        // Category intent: "show me wildlife photos"
        const catKey = Object.keys(P.categories).find((k) => new RegExp(`\\b${k}\\b|\\b${P.categories[k].name.toLowerCase()}\\b`).test(s));
        const subjectMatch = raw.toLowerCase().match(/\b(?:photos?|pictures?|pics?|images?|shots?)\s+(?:of|from|in|at|showing|with)\s+(?:the\s+)?(.+?)[?.!]*$/) ||
            raw.toLowerCase().match(/\b(?:show|find|see|search(?: for)?|look(?:ing)? for|any|have|got)\s+(?:me\s+)?(?:some\s+|any\s+|your\s+)?(.+?)\s+(?:photos?|pictures?|pics?|images?|shots?)\b/) ||
            raw.toLowerCase().match(/\b(?:show|find|search(?: for)?)\s+(?:me\s+)?(?:photos?\s+|pictures?\s+)?(?:of\s+)?(.+?)[?.!]*$/);

        const wantsPhotos = PHOTO_WORDS.test(s) && SHOW_INTENT.test(s);
        if (!wantsPhotos && !(subjectMatch && /\b(show|find|search)\b/.test(s))) return null;

        let subject = subjectMatch ? subjectMatch[1].replace(/\b(your|you|the|some|any|please|me|photos?|pictures?)\b/g, ' ').replace(/\s+/g, ' ').trim() : '';
        if (catKey && (!subject || subject === catKey || subject === P.categories[catKey].name.toLowerCase())) {
            const n = P.counts()[catKey] || 0;
            return {
                text: `There are **${n} ${P.categories[catKey].name.toLowerCase()} photos** — ${P.categories[catKey].description.toLowerCase()}. I can open that category in the gallery for you.`,
                actions: [{ label: `Show ${P.categories[catKey].name}`, action: `gallery:category:${catKey}` }],
                id: 'portfolio-category'
            };
        }
        if (!subject) return null;
        const results = P.search(subject, 200);
        if (!results.length) {
            return {
                text: `I couldn't find photos matching **“${subject}”** in the portfolio. Try a place (e.g. *Niagara*, *Butchart*, *Victoria*), a subject (*waterfall*, *butterfly*, *bridge*) or a category (*nature*, *urban*, *water*, *wildlife*).`,
                id: 'portfolio-search-empty'
            };
        }
        const sample = results.slice(0, 5).map((p) => `- ${p.title} — _${p.location}_`).join('\n');
        return {
            text: `I found **${results.length} photo${results.length === 1 ? '' : 's'}** matching **“${subject}”**, for example:\n\n${sample}`,
            actions: [{ label: `Show all ${results.length} in gallery`, action: `gallery:search:${subject}` }, { label: 'Open first photo', action: `gallery:open:${results[0].src}` }],
            id: 'portfolio-search'
        };
    }

    /* ==================== Small talk & meta ==================== */

    // Sites can override the greeting and help text via ARC.config.ASSISTANT = { greeting, helpText }.
    const assistantCfg = () => (ARC.config && ARC.config.ASSISTANT) || {};
    const SMALLTALK = [
        { re: /^(hi|hello|hey|hiya|howdy|good (morning|afternoon|evening)|greetings|yo)\b[!. ]*$/, text: () => assistantCfg().greeting || `Hello! 👋 I'm the ARC-NATURE photo assistant. Ask me about the portfolio, prints and downloads, or any photography question — camera settings, composition, lenses, editing and more.`, suggest: true },
        { re: /\b(thanks|thank you|thx|cheers|appreciate it|much appreciated)\b/, text: () => `You're welcome! Anything else you'd like to know?` },
        { re: /^(bye|goodbye|see you|see ya|later|good night)\b/, text: () => `Thanks for visiting ARC-NATURE PHOTOGRAPHY — happy shooting! 📷` },
        { re: /\b(how are you|how's it going|how are things)\b/, text: () => `I'm doing well, thanks for asking! What can I help you with — the gallery or a photography question?` },
        { re: /\b(who|what) are you\b|\bare you (a |an )?(bot|ai|human|real)\b|\bwhat can you do\b|\bhelp me\b$|^help$|\bwhat do you know\b/, text: () => helpText(), suggest: true },
        { re: /\b(you'?re|you are) (great|awesome|helpful|amazing|cool)\b|\bgood bot\b/, text: () => `That's kind of you — thank you! 😊` },
        { re: /\b(joke|make me laugh)\b/, text: () => `Why did the photographer break up with the camera? It kept trying to **focus** on everything else. 📸` }
    ];

    const helpText = () => (assistantCfg().helpText ? assistantCfg().helpText(ARC.KB.length) : defaultHelp());
    const defaultHelp = () => `I'm a photography assistant with a curated knowledge base (${ARC.KB.length}+ topics)${ARC.config?.CHAT_API_URL ? ' and an AI model for open-ended questions' : ''}. I can help with:\n\n` +
        `- **This portfolio** — find photos (“show me waterfalls in Ontario”), categories, locations\n` +
        `- **Downloads, licensing & prints** — free downloads, unlimited access, contact\n` +
        `- **Camera basics** — exposure, aperture, shutter speed, ISO, focus, white balance\n` +
        `- **Techniques** — landscapes, long exposure, astro, wildlife, macro, portraits, street…\n` +
        `- **Gear** — choosing a camera, lenses, tripods, filters\n` +
        `- **Editing** — Lightroom workflow, colour, noise, sharpening, exporting & printing\n` +
        `- **Calculators** — 500 rule, hyperfocal distance, ND filter times, print size, unit conversions\n\n` +
        `Ask follow-ups like “tell me more” or “what about at night?” — I remember the conversation. If I don't know something reliably, I'll say so.`;

    const FOLLOWUP_MORE = /^(tell me more( about (it|that|this))?|more( info| information| details)?|go on|continue|elaborate|explain( more| further| that| it)?|can you explain( that| more)?|details?|and|keep going|expand( on that)?|more please|why|how so|in more detail|anything else|what else)[\s?.!]*$/;
    const FOLLOWUP_CTX = /^(what about|how about|and (for|with|if|at|in|on)|what if|in that case|for (a |an )?|with (a |an )?|at night|in winter|in the rain|on (a |my )?(phone|iphone)|same for|is (it|that|this)|does (it|that|this)|which (one|lens|camera|setting)|why (is|does|do) (it|that|this)|should i|can i)\b/;

    /* ==================== Conversation ==================== */

    function createSession() {
        return { lastEntryId: null, lastTokens: [], turns: 0, moreShown: new Set() };
    }

    function asResult(entry, { confidence, via = 'kb', alternatives = [], prefix = '' } = {}) {
        return {
            text: prefix + entry.a,
            entryId: entry.id,
            title: entry.title,
            confidence,
            source: via,
            related: (entry.related || []).filter((id) => getIndex().byId.has(id)).slice(0, 4).map((id) => getIndex().byId.get(id)),
            alternatives,
            actions: entry.actions || [],
            hasMore: !!entry.more
        };
    }

    const HIGH = 4.2, LOW = 2.2;

    /**
     * Answer a message locally. Returns { text, source, confidence, related, actions, ... }.
     * `confidence`: 'high' | 'medium' | 'low' | 'none'.
     */
    function answer(message, session) {
        const raw = String(message || '').trim().slice(0, 600);
        if (!raw) return { text: 'Please type a question.', confidence: 'none', source: 'system' };
        const s = stripAccents(raw.toLowerCase()).replace(/[’‘]/g, "'");
        session.turns += 1;
        const last = session.lastEntryId ? getIndex().byId.get(session.lastEntryId) : null;

        // 1. Small talk
        for (const st of SMALLTALK) {
            if (st.re.test(s) && s.split(/\s+/).length <= 8) return { text: st.text(), confidence: 'high', source: 'assistant', suggest: !!st.suggest };
        }

        // 2. "Tell me more" style follow-ups
        if (FOLLOWUP_MORE.test(s) && s.split(/\s+/).length <= 6) {
            if (!last) return { text: `Happy to go deeper — which topic? For example “tell me more about long exposure”.`, confidence: 'low', source: 'assistant', suggest: true };
            if (last.more && !session.moreShown.has(last.id)) {
                session.moreShown.add(last.id);
                const r = asResult(last, { confidence: 'high' });
                r.text = last.more;
                r.hasMore = false;
                return r;
            }
            const rel = (last.related || []).map((id) => getIndex().byId.get(id)).filter(Boolean);
            return {
                text: rel.length ? `That's the core of **${last.title}**. Related topics you might like next:` : `That covers what I reliably know about **${last.title}**. Ask a more specific question and I'll do my best.`,
                confidence: 'medium', source: 'kb', related: rel.slice(0, 4)
            };
        }

        // 3. Tools
        for (const tool of TOOLS) {
            if (tool.test(s)) {
                const out = tool.run(s);
                if (out) {
                    return {
                        text: out.text, confidence: 'high', source: 'tool',
                        related: (out.related || []).map((id) => getIndex().byId.get(id)).filter(Boolean),
                        entryId: out.related?.[0] || session.lastEntryId
                    };
                }
            }
        }
        const pf = portfolioTool(raw, s);
        if (pf) return { text: pf.text, confidence: 'high', source: 'portfolio', actions: pf.actions || [] };

        // 4. Retrieval (+ context-aware retry for follow-ups)
        let results = rank(raw);
        const plainTop = results[0];
        const explicitFollow = FOLLOWUP_CTX.test(s);
        const shortFollow = tokenize(raw).length <= 2;
        if (last && (explicitFollow || shortFollow)) {
            // A clearly named new subject ("what about ISO?") beats the previous topic.
            const plainStrong = plainTop && plainTop.entry.id !== last.id && plainTop.exact >= 1 && plainTop.coverage >= 0.5 && plainTop.score >= LOW;
            if (!plainStrong) {
                const boost = tokenize(last.title).slice(0, 4);
                const ctx = rank(raw, { boostTokens: boost });
                if (ctx[0] && (!plainTop || ctx[0].score > plainTop.score)) results = ctx;
            }
        }

        // Subject boost: e.g. "is HE good at python" → prefer facts about the person over the generic topic.
        if (SITE_CFG.subjectPattern && SITE_CFG.subjectPattern.test(s) && results.length) {
            const topics = new Set(SITE_CFG.subjectTopics || []);
            results = results.map((r) => (topics.has(r.entry.topic) ? { ...r, score: r.score * 1.8 } : r)).sort((a, b) => b.score - a.score);
        }

        const top = results[0];
        if (top && top.coverage < 0.4) {
            // Only a small part of the question matched (e.g. "world" in "who won the world cup"):
            // suggestions would be unrelated, so offer none.
            return { text: null, confidence: 'none', source: 'kb', alternatives: [] };
        }
        if (!top || top.score < LOW) {
            return {
                text: null, confidence: 'none', source: 'kb',
                alternatives: results.slice(0, 3).map((r) => r.entry)
            };
        }
        const alts = results.slice(1, 4).filter((r) => r.score > top.score * 0.7).map((r) => r.entry);
        session.lastEntryId = top.entry.id;
        if (!top.exact) {
            // Only typo-corrected matches: too risky to answer outright.
            return { text: null, confidence: 'none', source: 'kb', alternatives: results.slice(0, 3).map((r) => r.entry) };
        }
        if (top.score >= HIGH && top.coverage >= 0.5) return asResult(top.entry, { confidence: 'high', alternatives: alts });
        return asResult(top.entry, { confidence: 'medium', alternatives: alts });
    }

    /** Short KB excerpts used to ground the remote AI model. */
    function contextFor(message, n = 4) {
        return rank(message, { limit: n }).filter((r) => r.score > 1).map((r) => ({ id: r.entry.id, title: r.entry.title, text: r.entry.a.slice(0, 1200) }));
    }

    function unknownText(alternatives = []) {
        const base = `I'm not confident I have a reliable answer to that, so I won't guess.`;
        const alt = alternatives.length ? `\n\nDid you mean one of these?` : '';
        const tail = assistantCfg().unknownTail || `\n\nFor questions about Ermias's work, prints or bookings, the **contact form** reaches him directly.`;
        return base + alt + (alternatives.length ? '' : tail);
    }

    ARC.chatEngine = { answer, rank, contextFor, createSession, normalize, tokenize, unknownText, buildIndex, safeEval };
    if (typeof module !== 'undefined' && module.exports) module.exports = ARC.chatEngine;
})(typeof window !== 'undefined' ? window : globalThis);
