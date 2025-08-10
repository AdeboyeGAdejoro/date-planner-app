// harvest/scripts/preview.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformOverpassElementToLocation } from './transform.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..', '..');

const rawArg = process.argv[2];
if (!rawArg) {
  console.error('Usage: node harvest/scripts/preview.mjs <path-to-raw.json>');
  console.error('Example: node harvest/scripts/preview.mjs harvest/output/raw/osm/2025-08-10/berlin-cinemas.raw.json');
  process.exit(1);
}

const rawPath = path.resolve(root, rawArg);
const json = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const elements = Array.isArray(json?.elements) ? json.elements : [];

const transformed = elements
  .map(transformOverpassElementToLocation)
  .filter(Boolean);

console.log(JSON.stringify(transformed.slice(0, 5), null, 2));
console.log(`\nPreviewed ${Math.min(5, transformed.length)} of ${transformed.length} total transformed locations.`);
