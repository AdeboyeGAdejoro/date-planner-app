[out:json][timeout:30];
area["name"="Berlin"]["boundary"="administrative"]->.a;
nwr["amenity"~"^(restaurant|cafe|bar|pub|biergarten)$"](area.a);
out center 30;
