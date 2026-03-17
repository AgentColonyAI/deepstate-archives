# DEEP STATE ARCHIVES

> *AI-powered satirical conspiracy theory generator. Enter a journalist, pick a topic, watch the paranoia unfold.*

**⚠️ SATIRE & PARODY ONLY — All output is fictional entertainment. Not intended to deceive.**

---

## What it does

You create a journalist with a name, publication, belief system, and obsessions. Then you enter any mundane topic — a city council vote, a new iPhone, bad traffic — and the system generates a 500-word satirical conspiracy theory article written entirely in that journalist's voice, with a thematically matched image.

---

## Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js + Express |
| AI Generation | Anthropic Claude (user-selectable model) |
| Image (optional) | Replicate SDXL |
| Image (fallback) | LoremFlickr (free, no key) |
| Frontend | Vanilla HTML/CSS/JS — 1970s mainframe terminal aesthetic |
| Deploy | Railway / Render / Fly.io |

---

## Setup — Local

```bash
# 1. Clone
git clone https://github.com/AgentColonyAI/deepstate-archives
cd deepstate-archives

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 4. Run
npm start
# → http://localhost:3000
```

---

## Setup — With AI Images (optional)

Get a free API key at [replicate.com](https://replicate.com/account/api-tokens) and add it to `.env`:

```
REPLICATE_API_KEY=your_key_here
```

Without this, the app uses LoremFlickr fallback images — still works great.

---

## Deploy to Railway (recommended — free tier)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Push to GitHub
2. Connect repo to Railway
3. Add environment variables in Railway dashboard
4. Deploy — done in ~60 seconds

## Deploy to Render (free tier)

1. Push to GitHub
2. New Web Service → connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars → Deploy

## Deploy to Fly.io

```bash
npm install -g flyctl
fly launch
fly secrets set ANTHROPIC_API_KEY=your_key
fly deploy
```

---

## How to use

1. **Register your operative** — fill in the journalist's name, publication, belief system, and obsessions. These directly shape every sentence of the output.

2. **Enter the ops room** — type any topic or news headline into the target subject field.

3. **Set your parameters** — choose humor style, mood, and writing style from the dropdowns.

4. **Initiate operation** — the system generates a ~500 word satirical conspiracy article in the journalist's voice, plus a thematic image.

5. **Download** — grab the article as a `.txt` file and the image separately.

---

## Project structure

```
deepstate/
├── server.js          # Express backend + API proxy
├── public/
│   └── index.html     # Full-screen 1970s terminal UI
├── .env               # Your API keys (never commit this)
├── .env.example       # Template
├── package.json
└── README.md
```

---

## Design

The UI is a full-viewport 1970s mainframe terminal scene — no scroll, no sidebars. The terminal fills the screen against a dark concrete basement backdrop. All interaction happens inside the CRT screen in green phosphor text with scanlines and authentic CRT effects. Keyboard and bezel are rendered in CSS below the screen.

---

## License

MIT — use it, fork it, ship it.

---

*All generated content is satire and parody for entertainment purposes only.*
*Deep State Archives does not endorse conspiracy theories.*
