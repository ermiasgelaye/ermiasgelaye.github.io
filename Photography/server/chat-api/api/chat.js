/**
 * ARC Photo Assistant — AI proxy (Vercel serverless function: POST /api/chat).
 *
 * The browser NEVER sees the AI key. The frontend sends { messages, context } where
 * `context` holds short excerpts from the site's own knowledge base; the model is told to
 * prefer them and to say when it does not know.
 *
 * Environment variables (set in the Vercel dashboard, never commit them):
 *   AI_API_KEY        – provider API key (required)
 *   AI_MODEL          – model id to use (required)
 *   AI_API_URL        – OpenAI-compatible chat completions URL
 *                       (default https://api.openai.com/v1/chat/completions)
 *   ALLOWED_ORIGINS   – comma-separated origins allowed to call this endpoint
 *                       (default https://ermiasgelaye.github.io)
 */

const DEFAULT_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_MESSAGES = 10;
const MAX_CHARS = 2000;
const RATE = { windowMs: 60_000, max: 12 }; // per IP, best effort (per warm instance)
const hits = new Map();

const SYSTEM_PROMPT = `You are the Photo Assistant on ARC-NATURE PHOTOGRAPHY, the photography portfolio of Ermias Gaga (mostly Canadian nature, landscape, travel, urban, water and wildlife photos).

Rules:
- Be accurate, clear and friendly. Use short paragraphs and "-" bullet lists; **bold** for key settings. Keep answers under ~250 words unless asked for detail.
- Photography questions (cameras, lenses, exposure, composition, lighting, editing, printing, gear, technique) are your speciality — beginner to advanced. Give concrete starting settings when helpful and note they are starting points.
- You may answer general questions briefly when you are confident.
- Facts about THIS website (prices, download limits, licensing, prints, workshops, contact) must come ONLY from the provided SITE CONTEXT. If the context does not cover it, say you are not sure and suggest the contact form. Never invent prices, dates, policies, or details about Ermias.
- You have no internet access or live data (weather, news, prices). Say so if asked.
- If you are not confident an answer is correct, say so plainly instead of guessing.`;

function rateLimited(ip) {
    const now = Date.now();
    const rec = hits.get(ip) || { count: 0, start: now };
    if (now - rec.start > RATE.windowMs) { rec.count = 0; rec.start = now; }
    rec.count += 1;
    hits.set(ip, rec);
    if (hits.size > 5000) hits.clear();
    return rec.count > RATE.max;
}

function cors(req, res) {
    const allowed = (process.env.ALLOWED_ORIGINS || 'https://ermiasgelaye.github.io').split(',').map((s) => s.trim());
    const origin = req.headers.origin || '';
    if (allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return allowed.includes(origin);
}

function sanitize(body) {
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const clean = messages
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-MAX_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    const context = (Array.isArray(body?.context) ? body.context : [])
        .slice(0, 5)
        .filter((c) => c && typeof c.text === 'string')
        .map((c) => `### ${String(c.title || '').slice(0, 120)}\n${c.text.slice(0, 1500)}`)
        .join('\n\n');
    return { messages: clean, context };
}

module.exports = async function handler(req, res) {
    const originOk = cors(req, res);
    if (req.method === 'OPTIONS') return res.status(originOk ? 204 : 403).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!originOk) return res.status(403).json({ error: 'Origin not allowed' });

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
    if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

    const { AI_API_KEY, AI_MODEL } = process.env;
    if (!AI_API_KEY || !AI_MODEL) return res.status(503).json({ error: 'Assistant not configured' });

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
    const { messages, context } = sanitize(body);
    if (!messages.length || messages[messages.length - 1].role !== 'user') return res.status(400).json({ error: 'Invalid request' });

    const system = context
        ? `${SYSTEM_PROMPT}\n\nSITE CONTEXT (from the site's own knowledge base — prefer this):\n${context}`
        : SYSTEM_PROMPT;

    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 20_000);
        const r = await fetch(process.env.AI_API_URL || DEFAULT_URL, {
            method: 'POST',
            headers: { Authorization: `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: AI_MODEL, messages: [{ role: 'system', content: system }, ...messages], max_tokens: 600, temperature: 0.4 }),
            signal: ctrl.signal
        });
        clearTimeout(timer);
        if (!r.ok) {
            console.error('AI provider error', r.status, (await r.text()).slice(0, 500));
            return res.status(502).json({ error: 'Upstream error' });
        }
        const data = await r.json();
        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (!reply) return res.status(502).json({ error: 'Empty reply' });
        return res.status(200).json({ reply });
    } catch (err) {
        console.error('AI request failed', err?.name || err);
        return res.status(504).json({ error: 'Timeout' });
    }
};
