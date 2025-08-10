[out:json][timeout:30];
/* Lagos Island approx center: lat=6.45407, lon=3.39467 */
(
  nwr["amenity"~"^(restaurant|cafe|bar|pub|biergarten|fast_food)$"](around:15000,6.45407,3.39467);
);
out center 30;
