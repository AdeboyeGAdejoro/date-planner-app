// harvest/scripts/transform.mjs
// ESM module that converts ONE Overpass element → your Location shape.

export function osmToDateType(tags = {}) {
  const a = tags.amenity;
  const t = tags.tourism;

  if (a && /^(restaurant|cafe|fast_food|bar|pub|biergarten)$/.test(a)) return "Dining";
  if (a === "cinema") return "Movies";
  if ((t && /^(museum|gallery)$/.test(t)) || a === "arts_centre") return "Museums/Exhibitions";

  // Safe default
  return "Dining";
}

export function buildAddress(tags = {}) {
  const line1 = [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" ").trim();
  const line2 = [tags["addr:postcode"], tags["addr:city"] || tags["addr:town"] || tags["addr:suburb"]]
    .filter(Boolean)
    .join(" ")
    .trim();
  return [line1, line2].filter(Boolean).join(", ");
}

export function pickLink(el) {
  const tags = el?.tags ?? {};
  return (
    tags.website ||
    tags["contact:website"] ||
    tags.url ||
    `https://www.openstreetmap.org/${el.type}/${el.id}`
  );
}

/**
 * Transform ONE Overpass element → your Location shape.
 * Returns null if we can't form a sensible entry (e.g., missing name).
 */
export function transformOverpassElementToLocation(el) {
  const tags = el?.tags ?? {};
  const name = tags.name || tags["name:en"];
  if (!name) return null;

  return {
    id: `${el.type}/${el.id}`,
    type: osmToDateType(tags),                // "Dining" | "Movies" | "Museums/Exhibitions"
    name,
    address: buildAddress(tags),              // may be ""
    country: tags["addr:country"] || "",
    city: tags["addr:city"] || tags["addr:town"] || tags["addr:suburb"] || "",
    rating: Number(tags.rating ?? 0),         // OSM rarely has ratings
    link: pickLink(el),
    images: [],                               // OSM doesn't provide photos directly
  };
}
