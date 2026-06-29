import express from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_PATH = join(__dirname, 'config.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

app.get('/api/config', (req, res) => {
  if (existsSync(CONFIG_PATH)) {
    const data = readFileSync(CONFIG_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } else {
    res.json(null);
  }
});

app.post('/api/config', (req, res) => {
  try {
    writeFileSync(CONFIG_PATH, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});