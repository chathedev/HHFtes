// server.cjs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Använd PORT från miljövariabler eller 3001

// Middleware
app.use(cors()); // Tillåt CORS från alla ursprung för enkelhetens skull i demo. I prod, begränsa till din frontend-domän.
app.use(bodyParser.json()); // För att parsa JSON-request bodies

// HHF BACKEND PART

// Enkel autentiserings-middleware (JWT, API-nyckel etc)
function authenticate(req, res, next) {
  // TODO: Byt ut mot riktig JWT-/API-nyckel-verifiering
  const token = req.headers['authorization'];
  const expectedSecret = process.env.API_SECRET; // Hämta från miljövariabel

  if (!expectedSecret) {
    console.error('API_SECRET environment variable is not set!');
    return res.status(500).json({ message: 'Server configuration error: API_SECRET missing.' });
  }

  if (!token || token !== `Bearer ${expectedSecret}`) {
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
  console.warn('No content.json found, creating new one with default structure.');
  currentContent = {
    hero: {},
    stats: {},
    aboutClub: {},
    partnersCarousel: {},
    kontaktPage: {},
    partnersPage: {},
    // Lägg till en tom array för sektioners ordning om den inte finns
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
  res.json(currentContent);
});

// POST: Uppdatera allt innehåll (kräver autentisering)
app.post('/api/content', authenticate, (req, res) => {
  const newContent = req.body;
  if (typeof newContent !== 'object' || Array.isArray(newContent)) {
    return res.status(400).json({ message: 'Invalid content format' });
  }

  // Behåll befintlig sektionsordning om den inte skickas med i newContent
  if (currentContent.sections && !newContent.sections) {
    newContent.sections = currentContent.sections;
  }

  currentContent = newContent;
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
    return res.status(200).json({ message: 'Content updated', content: currentContent });
  } catch (err) {
    console.error('Error writing content.json', err);
    return res.status(500).json({ message: 'Server error during save' });
  }
});

// Optional: PATCH för enstaka sektioner
app.patch('/api/content/:section', authenticate, (req, res) => {
  const section = req.params.section;
  const update = req.body;
  if (!currentContent[section] || typeof update !== 'object') {
    return res.status(400).json({ message: 'Invalid section or data' });
  }

  currentContent[section] = { ...currentContent[section], ...update };

  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
    res.json({ message: `Section ${section} updated`, content: currentContent[section] });
  } catch (err) {
    console.error('Error writing content.json for patch', err);
    return res.status(500).json({ message: 'Server error during patch' });
  }
});

// --- Drag & Drop Section Ordering ---

// GET: Hämta lista över sektioner (med typ & ordning)
app.get('/api/sections', (req, res) => {
  const sections = currentContent.sections || [];
  res.json(sections);
});

// POST: Uppdatera sektioners ordning (kräver auth)
app.post('/api/sections', authenticate, (req, res) => {
  const { order } = req.body; // förväntas vara en array av sektionstyper i ny ordning

  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Invalid order format' });
  }

  currentContent.sections = order;

  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');
    res.json({ message: 'Section order updated', sections: order });
  } catch (err) {
    console.error('Error writing content.json for section order', err);
    return res.status(500).json({ message: 'Server error during section order save' });
  }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
