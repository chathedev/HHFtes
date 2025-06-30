const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Använd PORT från env eller 3001

// Middleware
app.use(cors()); // Tillåt alla CORS-förfrågningar för enkelhetens skull i demo
app.use(bodyParser.json()); // För att parsa JSON-body i förfrågningar

// Enkel autentiserings-middleware (JWT, API-nyckel etc)
function authenticate(req, res, next) {
  // TODO: Byt ut mot riktig JWT-/API-nyckel-verifiering
  const token = req.headers['authorization'];
  if (!token || token !== `Bearer ${process.env.API_SECRET}`) {
    console.warn('Unauthorized access attempt:', req.ip, token);
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// ---- Filbaserat innehåll (demo) ----
const contentFilePath = path.join(__dirname, 'content.json');
let currentContent = {};

// Läs in befintligt innehåll eller initiera med tomt objekt
try {
  const raw = fs.readFileSync(contentFilePath, 'utf8');
  currentContent = JSON.parse(raw);
  console.log('content.json loaded successfully.');
} catch (err) {
  console.warn('No content.json found or error reading it, initializing with default structure.', err.message);
  // Initialisera med en tom struktur som matchar PageContent för att undvika undefined
  currentContent = {
    hero: {},
    stats: {},
    aboutClub: {},
    partnersCarousel: {},
    kontaktPage: {},
    partnersPage: {},
    sections: [],
  };
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2));
    console.log('New content.json created.');
  } catch (writeErr) {
    console.error('Error writing initial content.json:', writeErr);
  }
}

// ---- Endpoints ----

// GET: Hämta allt innehåll
app.get('/api/content', (req, res) => {
  console.log('GET /api/content requested.');
  res.json(currentContent);
});

// POST: Uppdatera allt innehåll (kräver autentisering)
app.post('/api/content', authenticate, (req, res) => {
  console.log('POST /api/content requested.');
  const newContent = req.body;
  if (typeof newContent !== 'object' || Array.isArray(newContent) || newContent === null) {
    console.warn('Invalid content received for POST /api/content:', newContent);
    return res.status(400).json({ message: 'Invalid content format' });
  }

  // Validera strukturen här om du vill
  // För demo, ersätter vi bara hela innehållet
  currentContent = newContent;

  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
    console.log('Content updated and saved to content.json.');
    return res.status(200).json({ message: 'Content updated', content: currentContent });
  } catch (err) {
    console.error('Error writing content.json:', err);
    return res.status(500).json({ message: 'Server error during save' });
  }
});

// Optional: PATCH för enstaka sektioner
app.patch('/api/content/:section', authenticate, (req, res) => {
  console.log(`PATCH /api/content/${req.params.section} requested.`);
  const section = req.params.section;
  const update = req.body;

  if (!currentContent[section] || typeof update !== 'object' || update === null || Array.isArray(update)) {
    console.warn(`Invalid section or data for PATCH /api/content/${section}:`, update);
    return res.status(400).json({ message: 'Invalid section or data' });
  }

  currentContent[section] = { ...currentContent[section], ...update };

  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
    console.log(`Section ${section} updated and saved.`);
    res.json({ message: `Section ${section} updated`, content: currentContent[section] });
  } catch (err) {
    console.error('Error writing content.json during PATCH:', err);
    return res.status(500).json({ message: 'Server error during save' });
  }
});

// --- Drag & Drop Section Ordering ---

// GET: Hämta lista över sektioner (med typ & ordning)
app.get('/api/sections', (req, res) => {
  console.log('GET /api/sections requested.');
  const sections = currentContent.sections || [];
  res.json(sections);
});

// POST: Uppdatera sektioners ordning (kräver auth)
app.post('/api/sections', authenticate, (req, res) => {
  console.log('POST /api/sections requested.');
  const { order } = req.body; // förväntas vara en array av sektionstyper i ny ordning

  if (!Array.isArray(order)) {
    console.warn('Invalid order format for POST /api/sections:', order);
    return res.status(400).json({ message: 'Invalid order format' });
  }

  currentContent.sections = order;

  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
    console.log('Section order updated and saved.');
    res.json({ message: 'Section order updated', sections: order });
  } catch (err) {
    console.error('Error writing content.json during section order update:', err);
    return res.status(500).json({ message: 'Server error during save' });
  }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API_SECRET: ${process.env.API_SECRET ? 'SET' : 'NOT SET'}`);
});
