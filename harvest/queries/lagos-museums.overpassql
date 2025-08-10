[out:json][timeout:30];
/* Lagos approx center: lat=6.5244, lon=3.3792 */
(
  nwr["tourism"~"^(museum|gallery)$"](around:20000,6.5244,3.3792);
  nwr["amenity"="arts_centre"](around:20000,6.5244,3.3792);
);
out center 30;
