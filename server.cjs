import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// Polyfill for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initiera Octokit via dynamisk import då det är ett ESM-paket
let octokit;
(async () => {
  const { Octokit } = await import('@octokit/rest');
  octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
})();

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const CONTENT_PATH = 'content.json'; // Use root path to your content.json in the repo

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const expressApp = express();
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

// ---- Middleware ----
expressApp.use(cors({ origin: ['https://hhf.wby.se', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean) }));
expressApp.use(express.json());

// Enkel autentiserings-middleware
function authenticate(req, res, next) {
  const auth  = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token || token !== process.env.API_SECRET) {
    console.warn('Unauthorized access attempt to API');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Läs in eller initiera content.json lokalt
const contentFilePath = path.join(__dirname, 'content.json');
let currentContent = {};

try {
  currentContent = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
  console.log('✅ Backend: content.json loaded locally.');
} catch (e) {
  console.warn('⚠️ Backend: content.json not found or invalid, initializing with default structure.');
  currentContent = {
    sections: [],
    hero: {},
    stats: {},
    aboutClub: {},
    partnersCarousel: {},
    kontaktPage: {},
    partnersPage: {}
  };
  fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2));
  console.log('✅ Backend: content.json initialized locally.');
}

// Hjälpfunktion: committa ändringar till GitHub
async function commitToGitHub(message, buffer) {
  let sha;
  // Försök hämta befintlig SHA, annars skapa ny fil
  try {
    const { data: fileData } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: CONTENT_PATH,
      ref: 'main'
    });
    sha = fileData.sha;
    console.log(`ℹ️ commitToGitHub: befintlig fil hittad, sha=${sha}`);
  } catch (err) {
    if (err.status === 404) {
      sha = undefined; // fil saknas
      console.log('ℹ️ commitToGitHub: ingen befintlig fil, skapar ny');
    } else {
      console.error('❌ commitToGitHub getContent-fel:', err);
      throw err;
    }
  }

  // Skapa eller uppdatera fil
  try {
    const action = sha ? 'uppdatera' : 'skapa';
    console.log(`ℹ️ commitToGitHub: försöker ${action} ${CONTENT_PATH} i repo ${GITHUB_OWNER}/${GITHUB_REPO}`);
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: CONTENT_PATH,
      message,
      content: buffer.toString('base64'),
      sha,
      branch: 'main'
    });
    console.log('✅ commitToGitHub: commit lyckades');
  } catch (err) {
    console.error('❌ commitToGitHub commit-fel:', err);
    throw err;
  }
}

// ---- Endpoints ----

// GET: Hämta allt innehåll
expressApp.get('/api/content', (req, res) => {
  res.json(currentContent);
});

// POST: Skriv över allt innehåll
expressApp.post('/api/content', authenticate, async (req, res) => {
  const newContent = req.body;
  if (typeof newContent !== 'object' || Array.isArray(newContent)) {
    return res.status(400).json({ message: 'Ogiltigt innehåll' });
  }

  currentContent = newContent;

  try {
    // Spara lokalt
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
    console.log('✅ Backend: content.json saved locally.');

    // Commit till GitHub
    const buf = Buffer.from(JSON.stringify(currentContent, null, 2));
    await commitToGitHub('Uppdatera content.json via API', buf);

    // Triggera Next.js ISR-revalidation
    if (process.env.FRONTEND_URL && process.env.REVALIDATE_SECRET) {
      try {
        const revalidateRes = await fetch(`${process.env.FRONTEND_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`);
        if (revalidateRes.ok) {
          console.log('✅ Backend: ISR revalidated successfully.');
        } else {
          console.error('❌ Backend: ISR revalidation failed:', revalidateRes.status, await revalidateRes.text());
        }
      } catch (e) {
        console.error('❌ Backend: Revalidate error:', e);
      }
    } else {
      console.warn('⚠️ Backend: Skipping ISR revalidation. FRONTEND_URL or REVALIDATE_SECRET not set.');
    }

    res.status(200).json({ message: 'Innehåll uppdaterat och committed', content: currentContent });
  } catch (err) {
    console.error('❌ Backend: Fel vid sparning eller commit:', err);
    res.status(500).json({ message: 'Serverfel vid sparande eller commit' });
  }
});

// PATCH: Uppdatera en enskild sektion
expressApp.patch('/api/content/:section', authenticate, async (req, res) => {
  const section = req.params.section;
  const update  = req.body;

  if (!currentContent[section] || typeof update !== 'object') {
    return res.status(400).json({ message: 'Ogiltig sektion eller data' });
  }

  currentContent[section] = { ...currentContent[section], ...update };
  fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
  console.log(`✅ Backend: Section ${section} saved locally.`);

  try {
    const buf = Buffer.from(JSON.stringify(currentContent, null, 2));
    await commitToGitHub(`Uppdatera sektion ${section} via API`, buf);

    // Triggera Next.js ISR-revalidation
    if (process.env.FRONTEND_URL && process.env.REVALIDATE_SECRET) {
      try {
        const revalidateRes = await fetch(`${process.env.FRONTEND_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`);
        if (revalidateRes.ok) {
          console.log('✅ Backend: ISR revalidated successfully.');
        } else {
          console.error('❌ Backend: ISR revalidation failed:', revalidateRes.status, await revalidateRes.text());
        }
      } catch (e) {
        console.error('❌ Backend: Revalidate error:', e);
      }
    } else {
      console.warn('⚠️ Backend: Skipping ISR revalidation. FRONTEND_URL or REVALIDATE_SECRET not set.');
    }

    res.json({ message: `Sektion ${section} uppdaterad och committed`, content: currentContent[section] });
  } catch (err) {
    console.error('❌ Backend: Commit-fel:', err);
    res.status(500).json({ message: 'Serverfel vid commit' });
  }
});

// DnD-ordering: GET och POST för sections
expressApp.get('/api/sections', (req, res) => {
  res.json(currentContent.sections || []);
});

expressApp.post('/api/sections', authenticate, async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Ogiltig order-format' });
  }

  currentContent.sections = order;
  fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
  console.log('✅ Backend: Sections order saved locally.');

  try {
    const buf = Buffer.from(JSON.stringify(currentContent, null, 2));
    await commitToGitHub('Uppdatera sektioners ordning via API', buf);
    res.json({ message: 'Sektioners ordning uppdaterad och committed', sections: order });
  } catch (err) {
    console.error('❌ Backend: Commit-fel:', err);
    res.status(500).json({ message: 'Serverfel vid commit av sections' });
  }
});

nextApp.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/a') {
        await nextApp.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        await nextApp.render(req, res, '/b', query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
