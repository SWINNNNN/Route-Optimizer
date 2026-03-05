// Basic Haversine distance formula to calculate distance between two coordinates in km
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

// Nearest Neighbor Algorithm for TSP
// Start at the first point (or a designated start point), find the nearest unvisited point, go there, repeat.
export const optimizeRoute = (stops) => {
    if (!stops || stops.length < 2) return stops;

    const points = [...stops];
    const startPoint = points[0]; // Assume first point added is the starting point
    const path = [startPoint];
    const unvisited = points.slice(1);

    let currentPoint = startPoint;

    while (unvisited.length > 0) {
        let nearestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < unvisited.length; i++) {
            const dist = calculateDistance(
                currentPoint.lat,
                currentPoint.lng,
                unvisited[i].lat,
                unvisited[i].lng
            );
            if (dist < minDistance) {
                minDistance = dist;
                nearestIndex = i;
            }
        }

        if (nearestIndex !== -1) {
            const nextPoint = unvisited[nearestIndex];
            path.push(nextPoint);
            currentPoint = nextPoint;
            unvisited.splice(nearestIndex, 1);
        } else {
            break; // Should not happen
        }
    }

    // Optional: Return to start? The requirements don't explicitly say it's a loop.
    // "visiting order". Usually implies A -> B -> C... -> End.
    // I will leave it as an open path for now.

    return path;
};

export const calculateTotalDistance = (route) => {
    let totalDist = 0;
    for (let i = 0; i < route.length - 1; i++) {
        totalDist += calculateDistance(
            route[i].lat,
            route[i].lng,
            route[i + 1].lat,
            route[i + 1].lng
        );
    }
    return totalDist;
};

export const estimateFuelCost = (distance, mileage, fuelPrice) => {
    // distance in km, mileage in km/l, price in currency/l
    if (!mileage || mileage <= 0) return 0;
    const fuelNeeded = distance / mileage;
    return fuelNeeded * (fuelPrice || 0);
};
