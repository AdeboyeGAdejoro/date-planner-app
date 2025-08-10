[out:json][timeout:30];
area["name"="Berlin"]["boundary"="administrative"]->.a;
nwr["tourism"~"^(museum|gallery)$"](area.a);
out center 30;
