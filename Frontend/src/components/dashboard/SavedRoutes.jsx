import React from 'react';
import { useRoute } from '../../context/RouteContext';
import { FolderOpen, Trash, Calendar } from 'lucide-react';
import '../common/Button.css';

const SavedRoutes = () => {
    const { savedRoutes, loadSavedRoute, deleteSavedRoute } = useRoute();

    if (savedRoutes.length === 0) return null;

    return (
        <div className="card saved-routes-card">
            <h3><FolderOpen size={20} /> Saved Trips</h3>
            <ul className="saved-list">
                {savedRoutes.map(route => (
                    <li key={route.id} className="saved-item">
                        <div className="saved-info" onClick={() => loadSavedRoute(route.id)}>
                            <span className="saved-name">{route.name}</span>
                            <span className="saved-meta">
                                {new Date(route.date).toLocaleDateString()} • {route.stops.length} stops
                            </span>
                        </div>
                        <button className="btn-icon delete-btn" onClick={() => deleteSavedRoute(route.id)}>
                            <Trash size={14} />
                        </button>
                    </li>
                ))}
            </ul>

            <style>{`
                .saved-routes-card {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 24px;
                    border-radius: 20px;
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--border-glass);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    margin-top: 24px;
                }
                .saved-routes-card h3 {
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.1rem;
                    font-weight: 800;
                }
                .saved-list {
                    list-style: none;
                    padding: 0;
                    margin: 20px 0 0 0;
                }
                .saved-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 12px;
                    border-bottom: 1px solid var(--border-light);
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 12px;
                }
                .saved-item:hover { background: rgba(255, 255, 255, 0.05); transform: translateX(4px); }
                .saved-item:last-child { border-bottom: none; }
                
                .saved-info { flex: 1; display: flex; flex-direction: column; }
                .saved-name { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
                .saved-meta { font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; font-weight: 500; }

            `}</style>
        </div>
    );
};

export default SavedRoutes;
