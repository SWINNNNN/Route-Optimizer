
export const getNearbyPlaces = async (lat, lng, type = 'hotel') => {
    // Wider search radius: 10km
    const radius = 10000;

    // Overpass QL query covering both OSM tagging conventions:
    //  - tourism=hotel|hostel|guest_house|apartment|motel
    //  - amenity=hotel|hostel  (very common in many regions)
    const query = `
        [out:json][timeout:30];
        (
          nwr["tourism"~"hotel|hostel|guest_house|apartment|motel"](around:${radius},${lat},${lng});
          nwr["amenity"~"hotel|hostel"](around:${radius},${lat},${lng});
        );
        out center 30;
    `;

    try {
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.elements) {
            return data.elements
                .filter(place => place.tags && place.tags.name) // only named places
                .map(place => ({
                    id: place.id,
                    name: place.tags.name,
                    type: place.tags.tourism || place.tags.amenity,
                    lat: place.lat || (place.center && place.center.lat),
                    lng: place.lon || (place.center && place.center.lon),
                    tags: place.tags
                }));
        }
        return [];
    } catch (error) {
        console.error("Places fetch failed", error);
        return [];
    }
};

export const getNearbyFuelStations = async (lat, lng) => {
    const radius = 15000; // 15km
    const query = `
        [out:json][timeout:30];
        (
          nwr["amenity"="fuel"](around:${radius},${lat},${lng});
        );
        out center 50;
    `;

    try {
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.elements) {
            return data.elements
                .map(place => ({
                    id: place.id,
                    name: place.tags.name || "Petrol Station",
                    lat: place.lat || (place.center && place.center.lat),
                    lng: place.lon || (place.center && place.center.lon),
                    tags: place.tags
                }));
        }
        return [];
    } catch (error) {
        console.error("Fuel stations fetch failed", error);
        return [];
    }
};
