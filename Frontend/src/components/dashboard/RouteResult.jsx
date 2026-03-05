import React, { useState } from 'react';
import { useRoute } from '../../context/RouteContext';
import { calculateDistance } from '../../utils/optimizer';
import { getWeatherDescription, getWeatherEmoji } from '../../utils/weather';
import { RefreshCw, BedDouble, ChevronDown, Download, Printer, MapPin, Clock, Fuel, Info, ChevronUp, Save } from 'lucide-react';
import MapPreview from './MapPreview';
import { motion, AnimatePresence } from 'framer-motion';

const RouteResult = () => {
    const { optimizedRoute, metrics, clearOptimization, saveCurrentRoute } = useRoute();
    const [expandedStays, setExpandedStays] = useState({}); // { stopId: boolean }
    const [routeName, setRouteName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const formatDuration = (mins) => {
        if (mins < 60) return `${Math.round(mins)} mins`;
        const hours = Math.floor(mins / 60);
        const remainingMins = Math.round(mins % 60);

        if (hours < 24) {
            return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
        }

        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    };

    if (!optimizedRoute || optimizedRoute.length === 0) return null;

    const toggleStays = (stopId) => {
        setExpandedStays(prev => ({
            ...prev,
            [stopId]: !prev[stopId]
        }));
    };

    const handleSave = async () => {
        if (!routeName.trim()) {
            alert('Please enter a name for your trip');
            return;
        }
        setIsSaving(true);
        await saveCurrentRoute(routeName);
        setIsSaving(false);
        setRouteName('');
        alert('Trip saved successfully!');
    };


    const handleExport = () => {
        const lines = [
            "ROUTEWISE - ITINERARY",
            "=================================",
            `Total Distance: ${metrics.totalDistance.toFixed(1)} km`,
            `Estimated Time: ${formatDuration(metrics.estimatedTime)}`,
            `Estimated Fuel Cost: ₹${metrics.estimatedCost.toFixed(0)}`,
            "",
            "ROUTE DETAILS:",
            ...optimizedRoute.map((stop, i) => {
                let line = `${i + 1}. ${stop.name}`;
                if (stop.weather) line += ` [Weather: ${stop.weather.temp}${stop.weather.unit}]`;
                return line;
            })
        ];

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `itinerary-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="route-result-premium fade-in">
            {/* Top Toolbar */}
            <div className="result-toolbar glass">
                <div className="toolbar-info">
                    <span className="itinerary-tag">Optimized Plan</span>
                    <h4>{optimizedRoute.length} Destinations</h4>
                </div>

                <div className="toolbar-save-section">
                    <input
                        type="text"
                        placeholder="Trip Name..."
                        value={routeName}
                        onChange={(e) => setRouteName(e.target.value)}
                        className="toolbar-input"
                    />
                    <button
                        className="tool-btn action-tool"
                        onClick={handleSave}
                        disabled={isSaving || !routeName.trim()}
                    >
                        <Save size={16} />
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                </div>


                <div className="toolbar-actions">
                    <button className="tool-btn icon-only" onClick={handleExport} title="Export">
                        <Download size={18} />
                    </button>
                    <button className="tool-btn icon-only" onClick={handlePrint} title="Print">
                        <Printer size={18} />
                    </button>
                    <button className="tool-btn primary-tool" onClick={clearOptimization}>
                        <RefreshCw size={16} />
                        <span>Edit</span>
                    </button>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="metrics-summary">
                <div className="metric-tile glass">
                    <div className="metric-icon bg-blue"><MapPin size={18} /></div>
                    <div className="metric-data">
                        <span className="m-label">Distance</span>
                        <span className="m-value">{metrics.totalDistance.toFixed(1)} km</span>
                    </div>
                </div>
                <div className="metric-tile glass">
                    <div className="metric-icon bg-purple"><Clock size={18} /></div>
                    <div className="metric-data">
                        <span className="m-label">Est. Time</span>
                        <span className="m-value">{formatDuration(metrics.estimatedTime)}</span>
                    </div>
                </div>
                <div className="metric-tile glass">
                    <div className="metric-icon bg-orange"><Fuel size={18} /></div>
                    <div className="metric-data">
                        <span className="m-label">Fuel Cost</span>
                        <span className="m-value">₹{metrics.estimatedCost.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <div className="timeline-container glass">
                <div className="timeline-header">
                    <h3>Itinerary Timeline</h3>
                </div>
                <div className="timeline-v2">
                    {optimizedRoute.map((stop, index) => {
                        const nextStop = optimizedRoute[index + 1];
                        const distToNext = nextStop
                            ? calculateDistance(stop.lat, stop.lng, nextStop.lat, nextStop.lng).toFixed(1)
                            : 0;
                        const isExpanded = expandedStays[stop.id];

                        return (
                            <motion.div
                                key={stop.id}
                                className="timeline-node"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="node-marker">
                                    <div className="node-dot"></div>
                                    {index !== optimizedRoute.length - 1 && <div className="node-connector"></div>}
                                </div>
                                <div className="node-body">
                                    <div className="node-main">
                                        <div className="node-title">
                                            <span className="node-number">{index + 1}</span>
                                            <h4>{stop.name}</h4>
                                        </div>
                                        <div className="node-badges">
                                            {/* Weather Badge */}
                                            {stop.loadingWeather ? (
                                                <div className="loading-badge">Weather...</div>
                                            ) : stop.weather ? (
                                                <div className="weather-badge glass" title={getWeatherDescription(stop.weather.code)}>
                                                    <span>{getWeatherEmoji(stop.weather.code)}</span>
                                                    <span>{stop.weather.temp}°</span>
                                                </div>
                                            ) : null}

                                            {/* Stays Badge */}
                                            {stop.loadingPlaces ? (
                                                <div className="loading-badge">Searching...</div>
                                            ) : stop.places && stop.places.length > 0 ? (
                                                <div className="stays-badge glass" onClick={() => toggleStays(stop.id)} style={{ cursor: 'pointer' }}>
                                                    <BedDouble size={12} />
                                                    <span>{stop.places.length} Stays</span>
                                                </div>
                                            ) : stop.places !== null ? (
                                                <div className="none-badge">No Stays</div>
                                            ) : null}

                                            {/* Fuel Badge */}
                                            {stop.loadingFuel ? (
                                                <div className="loading-badge">Fuel Checks...</div>
                                            ) : stop.fuelStations && stop.fuelStations.length > 0 ? (
                                                <div className="fuel-badge glass" onClick={() => toggleStays(stop.id)} style={{ cursor: 'pointer' }}>
                                                    <Fuel size={12} />
                                                    <span>{stop.fuelStations.length} Pumps</span>
                                                </div>
                                            ) : stop.fuelStations !== null ? (
                                                <div className="none-badge">No Fuel</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Recommendations Drawer */}
                                    {((stop.places && stop.places.length > 0) || (stop.fuelStations && stop.fuelStations.length > 0)) && (
                                        <motion.div
                                            className={`stays-drawer ${isExpanded ? 'expanded' : ''}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="drawer-handle"><Info size={12} /> Nearby Recommendations</div>

                                            {stop.places && stop.places.length > 0 && (
                                                <div className="recommendation-section">
                                                    <div className="section-label"><BedDouble size={10} /> Stays</div>
                                                    <ul className="stay-chips">
                                                        {(isExpanded ? stop.places : stop.places.slice(0, 3)).map(p => (
                                                            <li key={p.id}>{p.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {stop.fuelStations && stop.fuelStations.length > 0 && (
                                                <div className="recommendation-section">
                                                    <div className="section-label"><Fuel size={10} /> Petrol Pumps</div>
                                                    <ul className="stay-chips">
                                                        {(isExpanded ? stop.fuelStations : stop.fuelStations.slice(0, 3)).map(p => (
                                                            <li key={p.id}>{p.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {!isExpanded && ((stop.places?.length || 0) + (stop.fuelStations?.length || 0) > 6) && (
                                                <div className="more-chip" onClick={() => toggleStays(stop.id)} style={{ marginTop: '8px', textAlign: 'center' }}>
                                                    Show all recommendations
                                                </div>
                                            )}
                                            {isExpanded && (
                                                <div className="less-chip" onClick={() => toggleStays(stop.id)} style={{ marginTop: '8px', textAlign: 'center' }}>
                                                    Show less
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Travel Segment */}
                                    {index !== optimizedRoute.length - 1 && (
                                        <div className="travel-segment">
                                            <ChevronDown size={14} className="segment-icon" />
                                            <span>Drive {distToNext} km</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .route-result-premium { display: flex; flex-direction: column; gap: 24px; }
                
                .result-toolbar { 
                    padding: 12px 20px; 
                    border-radius: 20px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    border: 1px solid var(--border-glass); 
                    background: rgba(13, 17, 28, 0.6); 
                    backdrop-filter: blur(24px) saturate(200%); 
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); 
                    gap: 16px; 
                    flex-wrap: wrap;
                    margin-bottom: 24px;
                }
                .toolbar-info { flex-shrink: 0; min-width: 130px; }
                .itinerary-tag { font-size: 0.6rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 2px; }
                .toolbar-info h4 { font-size: 1rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -0.01em; }
                
                .toolbar-save-section { 
                    display: flex; 
                    gap: 8px; 
                    flex: 1; 
                    max-width: 280px; 
                    min-width: 200px;
                    align-items: center;
                }
                .toolbar-input { 
                    flex: 1; 
                    background: rgba(255, 255, 255, 0.05); 
                    border: 1px solid var(--border-light); 
                    padding: 0 12px; 
                    border-radius: 12px; 
                    font-size: 0.8rem; 
                    font-weight: 600; 
                    color: var(--text-primary); 
                    outline: none; 
                    height: 40px;
                    transition: all 0.2s;
                }
                .toolbar-input:focus { border-color: var(--primary); background: rgba(255, 255, 255, 0.08); }
                .toolbar-input::placeholder { color: var(--text-tertiary); opacity: 0.4; }

                .action-tool { 
                    background: var(--primary); 
                    color: white; 
                    border: none; 
                    padding: 0 14px; 
                    height: 40px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                }
                .action-tool:hover:not(:disabled) { background: var(--primary-light); transform: translateY(-1px); }
                .action-tool:disabled { opacity: 0.4; cursor: not-allowed; }
                
                .toolbar-actions { display: flex; gap: 8px; flex-shrink: 0; align-items: center;}
                .tool-btn { 
                    height: 40px; 
                    min-width: 40px;
                    border-radius: 12px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    transition: all 0.2s; 
                    background: rgba(255,255,255,0.05); 
                    color: var(--text-secondary); 
                    border: 1px solid var(--border-light); 
                    font-weight: 700; 
                    font-size: 0.8rem; 
                    padding: 0 12px;
                }
                .tool-btn.icon-only { width: 40px; padding: 0; }
                .tool-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); border-color: var(--border-medium); }
                .primary-tool { background: var(--primary); color: white; border: none; }
                .primary-tool:hover { background: var(--primary-light); transform: translateY(-1px); }

                .metrics-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
                .metric-tile { padding: 16px 20px; border-radius: 24px; display: flex; align-items: center; gap: 16px; border: 1px solid var(--border-glass); background: rgba(255,255,255,0.02); backdrop-filter: blur(12px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
                .metric-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
                .bg-blue { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); } 
                .bg-purple { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); } 
                .bg-orange { background: linear-gradient(135deg, #F59E0B 0%, #B45309 100%); }
                .metric-data { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
                .m-label { font-size: 0.65rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
                .m-value { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.01em; white-space: nowrap; }

                .timeline-container { border-radius: 32px; padding: 32px; border: 1px solid var(--border-glass); background: rgba(13, 17, 28, 0.4); backdrop-filter: blur(20px); }
                .timeline-header h3 { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 28px; border-bottom: 1px solid var(--border-light); padding-bottom: 16px; letter-spacing: -0.02em; }
                
                .timeline-v2 { display: flex; flex-direction: column; }
                .timeline-node { display: flex; gap: 24px; }
                .node-marker { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
                .node-dot { width: 14px; height: 14px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); margin-top: 8px; z-index: 2; position: relative; }
                .node-connector { flex: 1; width: 3px; background: linear-gradient(180deg, var(--primary) 0%, var(--border-light) 100%); margin: 6px 0; border-radius: 2px; opacity: 0.4; }
                
                .node-body { flex: 1; padding-bottom: 40px; }
                .node-main { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 24px; }
                .node-title { display: flex; align-items: flex-start; gap: 14px; flex: 1; min-width: 0; }
                .node-number { font-size: 0.85rem; font-weight: 800; color: var(--text-tertiary); margin-top: 2px; min-width: 20px; flex-shrink: 0; }
                .node-title h4 { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -0.01em; line-height: 1.4; flex: 1; overflow-wrap: break-word; word-break: normal; }
                
                .node-badges { display: flex; gap: 10px; flex-shrink: 0; align-items: flex-start; padding-top: 0; margin-top: -2px; }
                .weather-badge, .stays-badge { padding: 6px 14px; border-radius: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; border: 1px solid transparent; backdrop-filter: blur(8px); white-space: nowrap; flex-shrink: 0; }
                .weather-badge span, .stays-badge span { white-space: nowrap; flex-shrink: 0; }
                 .weather-badge { background: rgba(59, 130, 246, 0.15); color: #60A5FA; border-color: rgba(59, 130, 246, 0.1); }
                 .stays-badge { background: rgba(16, 185, 129, 0.15); color: #34D399; border-color: rgba(16, 185, 129, 0.1); }
                 .fuel-badge { background: rgba(245, 158, 11, 0.15); color: #FBBF24; border-color: rgba(245, 158, 11, 0.1); padding: 6px 14px; border-radius: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; backdrop-filter: blur(8px); white-space: nowrap; flex-shrink: 0; }
                 .stays-badge.interactive, .fuel-badge.interactive { cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .stays-badge.interactive:hover { background: rgba(16, 185, 129, 0.2); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
                .fuel-badge.interactive:hover { background: rgba(245, 158, 11, 0.2); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); }
                .stays-badge.active { background: var(--primary); color: white; border-color: var(--primary); }
                .loading-badge { font-size: 0.75rem; color: var(--warning); font-style: italic; font-weight: 600; }
                .none-badge { font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600; }
 
                .stays-drawer { background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 18px; border: 1px solid var(--border-glass); margin-top: 12px; transition: all 0.3s ease, border-color 0.3s ease, background 0.3s ease; }
                .stays-drawer.expanded { background: rgba(255, 255, 255, 0.05); border-color: rgba(16, 185, 129, 0.2); box-shadow: var(--shadow-md); }
                 .drawer-handle { font-size: 0.7rem; font-weight: 800; color: var(--text-tertiary); display: flex; align-items: center; gap: 8px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
                 .recommendation-section { margin-bottom: 12px; }
                 .section-label { font-size: 0.6rem; font-weight: 800; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
                 .stay-chips { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; margin: 0; }
                 .stay-chips li { padding: 6px 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-light); border-radius: 10px; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); transition: all 0.2s; }
                 .stay-chips li:hover:not(.more-chip):not(.less-chip) { background: rgba(255, 255, 255, 0.08); border-color: var(--primary); color: var(--primary); }
                 .more-chip, .less-chip { cursor: pointer; font-size: 0.8rem; padding: 8px; border-radius: 10px; font-weight: 800 !important; border: 1px solid var(--primary) !important; color: var(--primary) !important; background: rgba(59, 130, 246, 0.1) !important; }
                 .more-chip:hover, .less-chip:hover { background: var(--primary) !important; color: white !important; }
 
                .travel-segment { display: flex; align-items: center; gap: 10px; margin-top: 20px; color: var(--text-tertiary); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
                .segment-icon { color: var(--text-tertiary); opacity: 0.6; }


                @media (max-width: 900px) {
                    .result-toolbar { flex-wrap: wrap; height: auto; padding: 16px; }
                    .toolbar-save-section { order: 3; max-width: none; margin: 8px 0 0 0; width: 100%; }
                }

                @media print {
                    .result-toolbar, .metrics-summary, .travel-segment { display: none !important; }
                    .timeline-container { border: none; box-shadow: none; padding: 0; }
                    .timeline-node { page-break-inside: avoid; }
                }
            `}</style>

        </div>
    );
};

export default RouteResult;
