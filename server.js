require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const path      = require('path');

const app  = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── GENERATE ──────────────────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { journalist, topic, humor, mood, style } = req.body;

  // User-supplied key takes priority, then .env fallback
  const apiKey = req.headers['x-api-key'] || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(401).json({
      error: 'NO_KEY',
      message: 'No API key. Open Settings (gear icon) and enter your Anthropic API key.'
    });
  }

  if (!journalist || !topic) {
    return res.status(400).json({ error: 'Missing journalist or topic.' });
  }

  const client = new Anthropic({ apiKey });

  const sys = `You are a satirical conspiracy theory article generator. Output is SATIRE and PARODY — fictional entertainment only, clearly absurdist, not designed to deceive.

JOURNALIST: ${journalist.name} | ${journalist.alias}
BIO: ${journalist.bio}
BELIEF: ${journalist.belief}
OBSESSIONS: ${journalist.interests}

Write ~500 word satirical conspiracy article deeply in this journalist's voice — their obsessions and worldview must permeate every sentence. Return ONLY valid JSON, no markdown:
{
  "headline": "PUNCHY ALL-CAPS HEADLINE",
  "subheadline": "DRAMATIC SECONDARY LINE",
  "byline": "FILED FROM [ABSURD LOCATION]",
  "article": "full article, paragraphs separated by \\n\\n",
  "imageKeywords": ["word1", "word2", "word3"]
}`;

  try {
    const msg = await client.messages.create({
      model:    req.body.model || 'claude-sonnet-4-5-20250514',
      max_tokens: 1500,
      system:   sys,
      messages: [{ role: 'user', content:
        `TOPIC: ${topic}\nHUMOR: ${humor}\nMOOD: ${mood}\nSTYLE: ${style}`
      }]
    });

    const parsed = JSON.parse(msg.content[0].text.replace(/```json|```/g, '').trim());

    let imageUrl = null;
    if (process.env.REPLICATE_API_KEY) {
      imageUrl = await replicateImage(parsed.headline);
    } else {
      const kw = encodeURIComponent((parsed.imageKeywords || ['government','shadow']).slice(0,2).join(' '));
      imageUrl = `https://loremflickr.com/800/400/${kw}?lock=${Date.now()}`;
    }

    res.json({ ...parsed, imageUrl });

  } catch (err) {
    console.error(err.message);
    if (err.status === 401 || err.message?.includes('auth')) {
      return res.status(401).json({ error: 'INVALID_KEY', message: 'API key rejected. Check Settings.' });
    }
    res.status(500).json({ error: err.message });
  }
});

async function replicateImage(headline) {
  try {
    const r = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${process.env.REPLICATE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4', input: { prompt: `${headline}. Cinematic dark moody 1970s film noir photorealistic. No text.`, width: 768, height: 384 } })
    });
    let result = await r.json();
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(x => setTimeout(x, 1500));
      result = await (await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, { headers: { 'Authorization': `Token ${process.env.REPLICATE_API_KEY}` } })).json();
    }
    return result.output?.[0] || null;
  } catch { return null; }
}

app.get('/api/health', (req, res) => res.json({ status: 'ONLINE' }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║   DEEP STATE ARCHIVES — ONLINE           ║`);
  console.log(`║   http://localhost:${port}                 ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
});
