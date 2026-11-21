# ermiasgelaye.github.io

Portfolio of **Ermias Gelaye Gaga** — data scientist & research analyst, Toronto.
Live at <https://ermiasgelaye.github.io/>.

## What's here

| Path | What it is |
|---|---|
| `index.html` | Career page — about, skills, projects, experience, education, contact, portfolio assistant |
| `Photography/Home.html` | ARC-NATURE Photography — gallery, travel map, downloads/licensing, photo assistant (installable PWA) |
| `Matplotlib-Challenge/` | Pharmaceutical data analysis project (charts + data table) |
| `Web-Design-Challenge/` | Global weather analysis project (latitude vs. climate) |

## Code layout

```
assets/
  css/site.css            career-site styles (design tokens shared with Photography)
  css/project.css         project chart pages
  js/site.js              career-site behaviour + assistant configuration
  js/project.js           project pages (theme, menu)
  js/knowledge/*.js       career assistant knowledge base (about Ermias, data science, careers)
  shared/chat/            chat engine, UI and styles used by BOTH assistants
Photography/assets/       photography site (gallery, map, downloads) + its knowledge base
Photography/server/       optional server-side AI proxy for the assistants (keys stay on the server)
```

### Updating content
- **Career facts:** edit `index.html` and keep `assets/js/knowledge/career.js` in sync — the assistant only states what's written there.
- **Assistant knowledge:** add entries to any `knowledge/*.js` file (format documented in `Photography/server/chat-api/README.md`).
- **New photos:** see the header of `Photography/assets/js/data/photos.js`; map locations live in `places.js`.

No build step — plain HTML, CSS and JavaScript served by GitHub Pages.
