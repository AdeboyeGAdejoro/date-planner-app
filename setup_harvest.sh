#!/usr/bin/env bash
set -euo pipefail

# Resolve project root (the folder containing this script)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create folders
mkdir -p "$ROOT_DIR/harvest/queries" \
         "$ROOT_DIR/harvest/scripts" \
         "$ROOT_DIR/harvest/output/raw/osm" \
         "$ROOT_DIR/data/sources"

# Keep empty dirs tracked
touch "$ROOT_DIR/harvest/queries/.gitkeep" \
      "$ROOT_DIR/harvest/scripts/.gitkeep"

# OSM attribution (required by ODbL)
cat > "$ROOT_DIR/data/sources/OSM-ATTRIBUTION.md" <<'EOF'
# OpenStreetMap Attribution

This app uses data from OpenStreetMap.

© OpenStreetMap contributors.

OpenStreetMap data is made available under the Open Database License (ODbL).
For more information, see:
- https://www.openstreetmap.org/copyright
- https://opendatacommons.org/licenses/odbl/
EOF

# Harvest README (dev-only workflow)
cat > "$ROOT_DIR/harvest/README.md" <<'EOF'
# Harvest Workflow (Overpass → Locations)

This folder contains dev-only assets to fetch OpenStreetMap (OSM) data via Overpass,
inspect it, and transform it into the app's final dataset in `data/locations.json`.

## Structure
- `queries/` — Overpass QL files (e.g., `berlin-dining.overpassql`, `berlin-museums.overpassql`).
- `scripts/` — Fetch/transform orchestration (to be added later).
- `output/`
  - `raw/osm/` — Raw JSON dumps from Overpass (gitignored).

## Workflow (concept)
1. Put a small, focused Overpass query in `queries/`.
2. Run a fetch script (later) to POST the query to an Overpass endpoint.
3. Save raw JSON under `harvest/output/raw/osm/<YYYY-MM-DD>/...`.
4. Run a transform script (later) to convert Overpass elements → app's `Location` shape.
5. Write/merge the final array to `data/locations.json` (committed).
6. Ensure attribution is present in `data/sources/OSM-ATTRIBUTION.md`.

## Conventions
- Keep queries small and city/category-specific.
- Use `out center <limit>;` in queries while testing to keep results tiny.
- Be polite with public Overpass instances (throttle, retry, avoid hammering).
- Record the fetch date in filenames (e.g., `YYYY-MM-DD`) for traceability.

## Licensing
OpenStreetMap data is © OpenStreetMap contributors, licensed under ODbL.
If you redistribute the database, review ODbL requirements.
EOF

# Ensure .gitignore has the right lines
GITIGNORE="$ROOT_DIR/.gitignore"
touch "$GITIGNORE"

add_ignore() {
  local line="$1"
  if ! grep -qxF "$line" "$GITIGNORE"; then
    echo "$line" >> "$GITIGNORE"
  fi
}
add_ignore "/harvest/output/raw/"
add_ignore "/harvest/output/**/*.tmp"

echo "✔ Harvest scaffold created."
echo "   - harvest/{queries,scripts,output/raw/osm}"
echo "   - data/sources/OSM-ATTRIBUTION.md"
echo "   - harvest/README.md"
echo "   - .gitignore updated (raw outputs ignored)"
