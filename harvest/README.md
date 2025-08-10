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
