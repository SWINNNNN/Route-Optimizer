import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const StayIcon = L.divIcon({
    className: 'custom-stay-marker',
    html: `<div style="
        background-color: #22c55e;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6]
});

const MapPreview = ({ route, isImmersive = false }) => {
    // Default center (India) if no route is provided
    const defaultCenter = [20.5937, 78.9629];
    const hasRoute = route && route.length > 0;

    const center = hasRoute ? [route[0].lat, route[0].lng] : defaultCenter;
    const zoom = hasRoute ? (route.length > 1 ? 6 : 10) : 5;
    const positions = hasRoute ? route.map(stop => [stop.lat, stop.lng]) : [];

    return (
        <div className={`map-container ${isImmersive ? 'immersive' : ''}`}>
            <MapContainer
                center={center}
                zoom={zoom}
                key={hasRoute ? `route-${route.length}` : 'default-map'}
                scrollWheelZoom={true}
                style={{ height: isImmersive ? '100%' : '400px', width: '100%', borderRadius: isImmersive ? '0' : '12px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Route Path */}
                <Polyline positions={positions} color="#2563eb" weight={3} opacity={0.6} dashArray="5, 10" />

                {/* Main Stop Markers */}
                {hasRoute && route.map((stop, idx) => (
                    <React.Fragment key={stop.id}>
                        <Marker position={[stop.lat, stop.lng]}>
                            <Popup>
                                <strong>{idx + 1}. {stop.name}</strong>
                            </Popup>
                        </Marker>

                        {/* Stay Markers for this stop */}
                        {stop.places && stop.places.map(stay => (
                            <Marker
                                key={stay.id}
                                position={[stay.lat, stay.lng]}
                                icon={StayIcon}
                            >
                                <Popup>
                                    <div style={{ fontSize: '12px' }}>
                                        <div style={{ color: '#166534', fontWeight: 'bold' }}>Stay nearby {stop.name}:</div>
                                        <div>{stay.name}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </React.Fragment>
                ))}
            </MapContainer>
            <style>{`
                .map-container.immersive { height: 100%; width: 100%; }
                .leaflet-container { background: var(--bg-secondary); }
            `}</style>
        </div>
    );
};

export default MapPreview;
