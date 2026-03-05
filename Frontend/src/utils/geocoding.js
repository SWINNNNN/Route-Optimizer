
export const searchLocation = async (query, signal) => {
    try {
        const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=15`,
            { signal }
        );
        const data = await response.json();
        return data.features.map(item => {
            const p = item.properties;
            const parts = [p.name, p.street, p.city, p.state, p.country].filter(Boolean);
            return {
                name: parts.join(', '),
                shortName: p.name || parts[0],
                type: p.type,
                lat: item.geometry.coordinates[1],
                lng: item.geometry.coordinates[0],
                raw: item
            };
        });
    } catch (error) {
        if (error.name === 'AbortError') return null;
        console.error("Geocoding failed", error);
        return [];
    }
};

