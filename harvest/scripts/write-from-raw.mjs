// harvest/scripts/write-from-raw.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformOverpassElementToLocation } from './transform.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..', '..');

function ts() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

const args = process.argv.slice(2);
const rawArg = args.find(a => !a.startsWith('--'));
if (!rawArg) {
  console.error('Usage: node harvest/scripts/write-from-raw.mjs <path-to-raw.json> [--default-country=NG] [--default-city=Lagos]');
  process.exit(1);
}
const defaultCountry = (args.find(a => a.startsWith('--default-country='))?.split('=')[1]) || '';
const defaultCity    = (args.find(a => a.startsWith('--default-city='))?.split('=')[1]) || '';

const rawPath = path.resolve(root, rawArg);
const dataPath = path.join(root, 'data', 'locations.json');

// 1) Read raw
const json = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const elements = Array.isArray(json?.elements) ? json.elements : [];

// 2) Transform
// replace where we build `incoming` with this:
const incoming = elements
  .map(transformOverpassElementToLocation)
  .filter(Boolean)
  .map(loc => ({
    ...loc,
    country: loc.country || defaultCountry,
    city: loc.city || defaultCity,
  }));
// 3) Load existing and make a backup if present
let existing = [];
if (fs.existsSync(dataPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    if (!Array.isArray(existing)) existing = [];
    const backup = `${dataPath}.backup.${ts()}.json`;
    fs.copyFileSync(dataPath, backup);
    console.log(`Backup created: ${path.relative(root, backup)}`);
  } catch {
    existing = [];
  }
}

// 4) Merge by id (new overwrites old if same id)
const byId = new Map(existing.map(x => [x.id, x]));
for (const loc of incoming) byId.set(loc.id, loc);

// 5) Sort and write
const merged = Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, 'en'));
fs.mkdirSync(path.dirname(dataPath), { recursive: true });
fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2));

console.log(`Transformed ${incoming.length} locations`);
console.log(`Wrote ${merged.length} total → ${path.relative(root, dataPath)}`);
