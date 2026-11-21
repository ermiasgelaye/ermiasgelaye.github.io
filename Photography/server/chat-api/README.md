# Photo Assistant — optional AI backend

The chat assistant on `Home.html` works **without any server**: it answers from the
built-in knowledge base (`assets/js/chat/knowledge/*.js`), calculators and live portfolio search.

This folder adds an **optional** AI model for open-ended questions the knowledge base can't
answer confidently. The API key stays on the server — the website never sees it.

## How it fits together

```
Browser ──(question + KB excerpts)──▶  /api/chat  (this function, on Vercel)
                                          │  adds system prompt + AI_API_KEY
                                          ▼
                                   AI provider (OpenAI-compatible API)
```

The frontend only calls the AI when local confidence is not high, and falls back to the
knowledge base with a clear message if the service is down or rate-limited.

## Deploy

1. Copy `api/chat.js` into your existing Vercel backend project (the one serving
   `photo-backend-ten.vercel.app`), or deploy this folder as its own Vercel project.
2. In **Vercel → Project → Settings → Environment Variables**, add:
   - `AI_API_KEY` — your provider key (**never commit this**)
   - `AI_MODEL` — the model id to use
   - `AI_API_URL` — optional; any OpenAI-compatible chat-completions URL
   - `ALLOWED_ORIGINS` — `https://ermiasgelaye.github.io`
3. Redeploy, then set the endpoint in `assets/js/core.js`:
   ```js
   CHAT_API_URL: 'https://photo-backend-ten.vercel.app/api/chat',
   ```

## Safety built in

- Origin allow-list (CORS) and POST-only
- Input validation: max 10 messages × 2,000 chars, 5 context snippets
- Best-effort per-IP rate limit (12 requests/minute per warm instance) — add a durable limiter
  (e.g. Vercel KV / Upstash) if traffic grows
- 20 s upstream timeout; provider errors are logged server-side, never echoed to users
- System prompt forbids inventing site prices/policies and requires admitting uncertainty

## Extending the knowledge base

Add entries to any file in `assets/js/chat/knowledge/` (or create a new file and add a
`<script>` tag for it in `Home.html` before `engine.js`):

```js
ARC.KB.push({
  id: 'unique-id', topic: 'technique', level: 'beginner', title: 'Readable title',
  q: ['example question one', 'another way people ask it'],
  k: ['keywords', 'and phrases'],
  a: 'The answer. Supports **bold**, _italic_, `code`, "- " lists and "1. " lists.',
  more: 'Optional deeper answer shown on "tell me more".',
  related: ['other-entry-id'],
  actions: [{ label: 'Show winter photos', action: 'gallery:search:winter' }]
});
```

Action types: `gallery:category:<key>`, `gallery:search:<text>`, `gallery:open:<src>`,
`scroll:#id`, `contact:<inquiry type>`, `purchase`, `ask:<question>`.
