// harvest/scripts/fetch.mjs
import 'dotenv/config';                 // loads .env / .env.local
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OVERPASS_URL =
  process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const USER_AGENT =
  'date-planner-harvest/1.0 (+https://github.com/AdeboyeGAdejoro/date-planner-app)';

function todayStamp() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function postOverpass(query) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': USER_AGENT,
        },
        body: 'data=' + encodeURIComponent(query),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Overpass ${res.status} – ${text.slice(0, 200)}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
    }
  }
  throw lastErr;
}

const queryPath = process.argv[2];
if (!queryPath) {
  console.error(
    'Usage: node harvest/scripts/fetch.mjs harvest/queries/berlin-cinemas.overpassql'
  );
  process.exit(1);
}

const root = path.resolve(__dirname, '..', '..');
const query = fs.readFileSync(queryPath, 'utf8');

const json = await postOverpass(query);

const datedDir = path.join(root, 'harvest', 'output', 'raw', 'osm', todayStamp());
ensureDir(datedDir);

const base = path.basename(queryPath).replace(/\.[^.]+$/, '');
const outPath = path.join(datedDir, `${base}.raw.json`);

fs.writeFileSync(outPath, JSON.stringify(json, null, 2));

const count = Array.isArray(json.elements) ? json.elements.length : 0;
console.log(`Saved ${count} elements → ${path.relative(root, outPath)}`);
