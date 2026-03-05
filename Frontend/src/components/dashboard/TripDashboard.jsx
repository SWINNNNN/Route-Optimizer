import React from 'react';
import { useRoute } from '../../context/RouteContext';
import { MapPin, TrendingUp, Fuel, Luggage, Calendar, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TripDashboard = ({ setActiveTab }) => {
    const { savedRoutes, loadSavedRoute } = useRoute();

    const handleViewDetails = (id) => {
        loadSavedRoute(id);
        if (setActiveTab) {
            setActiveTab('planner');
        }
    };

    // Calculate aggregate stats
    const stats = savedRoutes.reduce((acc, route) => {
        acc.totalDistance += route.metrics?.totalDistance || 0;
        acc.totalCost += route.metrics?.estimatedCost || 0;
        return acc;
    }, { totalDistance: 0, totalCost: 0 });

    return (
        <div className="trip-dashboard-v2 fade-in">
            <div className="dashboard-hero">
                <div className="hero-text">
                    <h2>Welcome Back, <span className="text-primary italic">Traveler</span></h2>
                    <p>Your journey statistics and saved adventures at a glance.</p>
                </div>
            </div>

            {/* Insight Tiles Grid */}
            <div className="insight-grid">
                <motion.div
                    className="insight-tile glass"
                    whileHover={{ y: -5 }}
                >
                    <div className="insight-icon bg-blue-grad"><Luggage size={20} /></div>
                    <div className="insight-content">
                        <span className="insight-label">Trips Completed</span>
                        <span className="insight-value">{savedRoutes.length}</span>
                    </div>
                </motion.div>

                <motion.div
                    className="insight-tile glass"
                    whileHover={{ y: -5 }}
                >
                    <div className="insight-icon bg-green-grad"><TrendingUp size={20} /></div>
                    <div className="insight-content">
                        <span className="insight-label">Total Distance</span>
                        <span className="insight-value">{stats.totalDistance.toFixed(1)} <small>km</small></span>
                    </div>
                </motion.div>

                <motion.div
                    className="insight-tile glass"
                    whileHover={{ y: -5 }}
                >
                    <div className="insight-icon bg-orange-grad"><Fuel size={20} /></div>
                    <div className="insight-content">
                        <span className="insight-label">Fuel Investment</span>
                        <span className="insight-value">₹{stats.totalCost.toFixed(0)}</span>
                    </div>
                </motion.div>
            </div>

            {/* Recent Trips Section */}
            <div className="journeys-section">
                <div className="section-title">
                    <h3>Recent Adventures</h3>
                    <div className="title-line"></div>
                </div>

                {savedRoutes.length === 0 ? (
                    <div className="empty-journeys glass">
                        <MapPin size={32} className="text-tertiary" />
                        <p>No adventures recorded yet. Plan your first trip in the Planner!</p>
                    </div>
                ) : (
                    <div className="journey-cards-grid">
                        {savedRoutes.map((route, i) => (
                            <motion.div
                                key={route.id}
                                className="journey-card glass card-hover"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleViewDetails(route.id)}
                            >
                                <div className="card-top">
                                    <div className="trip-info">
                                        <div className="trip-tag">SAVED ROUTE</div>
                                        <h4>{route.name}</h4>
                                    </div>
                                    <div className="trip-date-badge">
                                        {new Date(route.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <div className="card-path">
                                    <span className="path-text">
                                        {route.stops.slice(0, 3).map(s => s.name).join(' → ')}
                                        {route.stops.length > 3 && ` +${route.stops.length - 3} more`}
                                    </span>
                                </div>

                                <div className="card-stats">
                                    <div className="mini-stat">
                                        <Clock size={12} />
                                        <span>{route.stops.length} Stops</span>
                                    </div>
                                    <div className="mini-stat">
                                        <TrendingUp size={12} />
                                        <span>{route.metrics?.totalDistance?.toFixed(0)} km</span>
                                    </div>
                                </div>

                                <div className="card-action">
                                    <span>View Details</span>
                                    <ChevronRight size={14} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .trip-dashboard-v2 { padding: 4px; display: flex; flex-direction: column; gap: 48px; }
                .dashboard-hero { margin-bottom: 12px; }
                .hero-text h2 { font-size: 2.8rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.04em; margin-bottom: 12px; }
                .hero-text h2 span { background: var(--brand-gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-style: normal; }
                .hero-text p { color: var(--text-secondary); font-size: 1.15rem; font-weight: 500; letter-spacing: -0.01em; }
  
                .insight-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
                .insight-tile { padding: 32px; border-radius: 32px; display: flex; align-items: center; gap: 24px; border: 1px solid var(--border-glass); background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .insight-tile:hover { transform: translateY(-8px); box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4); background: rgba(255, 255, 255, 0.06); border-color: var(--primary); }
                
                .insight-icon { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
                .bg-blue-grad { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); }
                .bg-green-grad { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
                .bg-orange-grad { background: linear-gradient(135deg, #F59E0B 0%, #B45309 100%); }
                
                .insight-content { display: flex; flex-direction: column; gap: 4px; }
                .insight-label { font-size: 0.75rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.1em; }
                .insight-value { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
                .insight-value small { font-size: 0.9rem; color: var(--text-tertiary); margin-left: 4px; }
  
                .journeys-section { display: flex; flex-direction: column; gap: 32px; }
                .section-title { display: flex; align-items: center; gap: 20px; }
                .section-title h3 { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; margin: 0; letter-spacing: -0.03em; }
                .title-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border-light) 0%, transparent 100%); opacity: 0.3; }
  
                .journey-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
                .journey-card { padding: 32px; border-radius: 32px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid var(--border-glass); display: flex; flex-direction: column; gap: 20px; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .journey-card:hover { transform: translateY(-10px); background: rgba(255, 255, 255, 0.05); border-color: var(--primary); box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4); }
                
                .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .trip-tag { font-size: 0.65rem; font-weight: 800; color: var(--primary); letter-spacing: 0.1em; margin-bottom: 6px; }
                .trip-info h4 { font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -0.02em; }
                .trip-date-badge { background: rgba(255, 255, 255, 0.05); padding: 6px 14px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); border: 1px solid var(--border-light); }
  
                .card-path { background: rgba(255, 255, 255, 0.03); padding: 18px; border-radius: 18px; border: 1px solid var(--border-light); }
                .path-text { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em; opacity: 0.9; }
  
                .card-stats { display: flex; gap: 20px; }
                .mini-stat { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
                .mini-stat svg { color: var(--primary); opacity: 0.8; }
                
                .card-action { margin-top: 12px; padding-top: 20px; border-top: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; font-weight: 800; color: var(--primary); transition: all 0.3s; }
                .card-action svg { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .journey-card:hover .card-action svg { transform: translateX(6px); }
  
                .empty-journeys { padding: 80px 48px; text-align: center; border-radius: 32px; color: var(--text-tertiary); background: rgba(255, 255, 255, 0.02); border: 2px dashed var(--border-light); }

            `}</style>

        </div>
    );
};

export default TripDashboard;
