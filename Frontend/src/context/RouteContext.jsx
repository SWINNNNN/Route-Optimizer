import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { optimizeRoute as runOptimization, calculateTotalDistance, estimateFuelCost } from '../utils/optimizer';
import { getWeather } from '../utils/weather';
import { getNearbyPlaces, getNearbyFuelStations } from '../utils/places';
import { useAuth } from './AuthContext';

const RouteContext = createContext();

export const useRoute = () => {
    return useContext(RouteContext);
};

// Helper to get auth header
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const RouteProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [stops, setStops] = useState([]);
    const [optimizedRoute, setOptimizedRoute] = useState([]);
    const [fuelSettings, setFuelSettings] = useState({
        mileage: 15, // km/l example default
        fuelPrice: 100, // per liter example default
    });
    const [savedRoutes, setSavedRoutes] = useState([]);

    const [metrics, setMetrics] = useState({
        totalDistance: 0,
        estimatedCost: 0,
        estimatedTime: 0, // minutes
    });

    // Fetch saved routes from API when authenticated
    const fetchSavedRoutes = useCallback(async () => {
        try {
            const res = await fetch('/api/routes', {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                // Map _id to id for frontend compatibility
                setSavedRoutes(data.map(r => ({ ...r, id: r._id })));
            }
        } catch (error) {
            console.error('Failed to fetch saved routes:', error);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSavedRoutes();
        } else {
            setSavedRoutes([]);
        }
    }, [isAuthenticated, fetchSavedRoutes]);

    // Automatically keep metrics in sync with current active route
    useEffect(() => {
        const activeRoute = optimizedRoute.length > 0 ? optimizedRoute : stops;
        if (activeRoute.length < 2) {
            setMetrics({ totalDistance: 0, estimatedCost: 0, estimatedTime: 0 });
            return;
        }

        const distance = calculateTotalDistance(activeRoute);
        const cost = estimateFuelCost(distance, fuelSettings.mileage, fuelSettings.fuelPrice);
        // time (mins) = dist * 1.2
        const time = distance * 1.2;

        setMetrics({
            totalDistance: distance,
            estimatedCost: cost,
            estimatedTime: time,
        });
    }, [stops, optimizedRoute, fuelSettings.mileage, fuelSettings.fuelPrice]);

    const addStop = async (stop) => {
        const newStop = {
            ...stop,
            id: Date.now() + Math.random(),
            weather: null,
            places: null, // use null for "not fetched", [] for "fetched but empty"
            fuelStations: null,
            loadingWeather: true,
            loadingPlaces: true,
            loadingFuel: true
        };
        setStops(prev => [...prev, newStop]);

        const updateState = (id, data) => {
            const updater = s => s.id === id ? { ...s, ...data } : s;
            setStops(prev => prev.map(updater));
            setOptimizedRoute(prev => prev.map(updater));
        };

        // Fetch weather independently
        getWeather(stop.lat, stop.lng)
            .then(weather => {
                updateState(newStop.id, { weather, loadingWeather: false });
            })
            .catch(err => {
                console.error("Weather enrichment failed", err);
                updateState(newStop.id, { loadingWeather: false });
            });

        // Fetch places independently
        getNearbyPlaces(stop.lat, stop.lng)
            .then(places => {
                updateState(newStop.id, { places: places || [], loadingPlaces: false });
            })
            .catch(err => {
                console.error("Places enrichment failed", err);
                updateState(newStop.id, { loadingPlaces: false });
            });

        // Fetch fuel stations independently
        getNearbyFuelStations(stop.lat, stop.lng)
            .then(fuelStations => {
                updateState(newStop.id, { fuelStations: fuelStations || [], loadingFuel: false });
            })
            .catch(err => {
                console.error("Fuel stations enrichment failed", err);
                updateState(newStop.id, { loadingFuel: false });
            });
    };

    const removeStop = (id) => {
        setStops(prev => prev.filter(s => s.id !== id));
    };

    const updateStop = (id, updatedStop) => {
        setStops(prev => prev.map(s => s.id === id ? { ...s, ...updatedStop } : s));
    };

    const reorderStops = (newOrder) => {
        setStops(newOrder);
    };

    const saveCurrentRoute = async (name) => {
        const routeToSave = optimizedRoute.length > 0 ? optimizedRoute : stops;
        if (routeToSave.length === 0) return;

        try {
            const res = await fetch('/api/routes', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name,
                    date: new Date().toISOString(),
                    stops: routeToSave,
                    metrics,
                    // Populate top-level fields for database visibility
                    totalDistance: metrics.totalDistance,
                    totalStops: routeToSave.length,
                    estimatedCost: metrics.estimatedCost,
                    estimatedTime: metrics.estimatedTime,
                }),
            });
            if (res.ok) {
                await fetchSavedRoutes();
            }
        } catch (error) {
            console.error('Failed to save route:', error);
        }
    };

    const loadSavedRoute = (routeId) => {
        const route = savedRoutes.find(r => r.id === routeId);
        if (route) {
            // Prepare stops with loading states for missing data
            const enrichedStops = route.stops.map(stop => ({
                ...stop,
                loadingWeather: stop.weather === undefined || stop.weather === null,
                loadingPlaces: stop.places === undefined || stop.places === null,
                loadingFuel: stop.fuelStations === undefined || stop.fuelStations === null,
                // Ensure properties exist if they were missing in older saves
                weather: stop.weather || null,
                places: stop.places || null,
                fuelStations: stop.fuelStations || null
            }));

            setStops(enrichedStops);
            if (route.metrics && route.metrics.totalDistance > 0) {
                setOptimizedRoute(enrichedStops);
            } else {
                setOptimizedRoute([]);
            }

            // Fetch missing data for each stop
            enrichedStops.forEach(stop => {
                const updateItem = (id, data) => {
                    const updater = s => s.id === id ? { ...s, ...data } : s;
                    setStops(prev => prev.map(updater));
                    setOptimizedRoute(prev => prev.map(updater));
                };

                if (stop.weather === null || stop.weather === undefined) {
                    getWeather(stop.lat, stop.lng)
                        .then(w => updateItem(stop.id, { weather: w, loadingWeather: false }))
                        .catch(() => updateItem(stop.id, { loadingWeather: false }));
                }
                if (stop.places === null || stop.places === undefined) {
                    getNearbyPlaces(stop.lat, stop.lng)
                        .then(p => updateItem(stop.id, { places: p || [], loadingPlaces: false }))
                        .catch(() => updateItem(stop.id, { loadingPlaces: false }));
                }
                if (stop.fuelStations === null || stop.fuelStations === undefined) {
                    getNearbyFuelStations(stop.lat, stop.lng)
                        .then(f => updateItem(stop.id, { fuelStations: f || [], loadingFuel: false }))
                        .catch(() => updateItem(stop.id, { loadingFuel: false }));
                }
            });
        }
    };

    const deleteSavedRoute = async (routeId) => {
        try {
            const res = await fetch(`/api/routes/${routeId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                setSavedRoutes(prev => prev.filter(r => r.id !== routeId));
            }
        } catch (error) {
            console.error('Failed to delete route:', error);
        }
    };

    const updateFuelSettings = (settings) => {
        setFuelSettings(prev => ({ ...prev, ...settings }));
    };

    const optimize = () => {
        const route = runOptimization(stops);
        setOptimizedRoute(route);
        // metrics will be updated by useEffect
    };

    const clearRoutes = () => {
        setStops([]);
        setOptimizedRoute([]);
        setMetrics({ totalDistance: 0, estimatedCost: 0, estimatedTime: 0 });
    };

    const clearOptimization = () => {
        setOptimizedRoute([]);
        // metrics will naturally revert to base stops order via useEffect
    };

    const value = {
        stops,
        optimizedRoute,
        fuelSettings,
        metrics,
        addStop,
        removeStop,
        updateStop,
        reorderStops,
        savedRoutes,
        saveCurrentRoute,
        loadSavedRoute,
        deleteSavedRoute,
        updateFuelSettings,
        optimize,
        clearRoutes,
        clearOptimization
    };

    return (
        <RouteContext.Provider value={value}>
            {children}
        </RouteContext.Provider>
    );
};
