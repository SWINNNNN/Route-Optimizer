import React, { useState } from 'react';
import { useRoute } from '../../context/RouteContext';
import { Trash2, Navigation, Save, GripVertical, Loader2, MapPin } from 'lucide-react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';

const SpotList = () => {
    const { stops, removeStop, reorderStops, optimize, isOptimizing, saveCurrentRoute } = useRoute();

    if (stops.length === 0) {
        return (
            <div className="empty-itinerary fade-in">
                <div className="empty-icon-box">
                    <MapPin size={32} />
                </div>
                <h3>Your trip is empty</h3>
                <p>Add destinations to start planning your perfect route.</p>
            </div>
        );
    }

    return (
        <div className="spot-list-premium fade-in">
            <div className="list-header">
                <h3>Current Itinerary</h3>
                <span className="stops-count">{stops.length} destinations</span>
            </div>

            <Reorder.Group
                axis="y"
                values={stops}
                onReorder={reorderStops}
                className="itinerary-items"
            >
                <AnimatePresence>
                    {stops.map((stop, index) => (
                        <Reorder.Item
                            key={stop.id}
                            value={stop}
                            className="itinerary-item glass"
                            whileDrag={{ scale: 1.02, boxShadow: "var(--shadow-xl)" }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="drag-handle">
                                <GripVertical size={16} />
                            </div>

                            <div className="item-index-box">
                                {index + 1}
                            </div>

                            <div className="item-content">
                                <h4>{stop.name}</h4>
                                <p className="full-name">{stop.fullName?.split(',').slice(1).join(',').trim() || 'Custom destination'}</p>
                            </div>

                            <button
                                className="remove-item-btn"
                                onClick={() => removeStop(stop.id)}
                                title="Remove Stop"
                            >
                                <Trash2 size={16} />
                            </button>
                        </Reorder.Item>
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {stops.length > 1 && (
                <div className="itinerary-actions glass slide-up">

                    <button
                        className="btn-optimize"
                        onClick={optimize}
                        disabled={isOptimizing}
                    >
                        {isOptimizing ? (
                            <>
                                <Loader2 className="spinner" size={18} />
                                <span>Optimizing Itinerary...</span>
                            </>
                        ) : (
                            <>
                                <Navigation size={18} />
                                <span>Optimize Route</span>
                            </>
                        )}
                    </button>
                    <p className="optimize-hint">Nearest neighbor algorithm for efficient travel.</p>
                </div>
            )}

            <style>{`
                .spot-list-premium { display: flex; flex-direction: column; gap: 24px; }
                .list-header { border-bottom: 2px solid var(--border-light); padding-bottom: 16px; display: flex; justify-content: space-between; align-items: baseline; }
                .list-header h3 { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
                .stops-count { font-size: 0.7rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
 
                .empty-itinerary { padding: 48px 32px; text-align: center; border-radius: 28px; color: var(--text-secondary); background: rgba(255, 255, 255, 0.02); }
                .empty-icon-box { background: rgba(59, 130, 246, 0.1); color: var(--primary); width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
                .empty-itinerary h3 { color: var(--text-primary); margin-bottom: 8px; font-weight: 800; letter-spacing: -0.01em; }
                .empty-itinerary p { font-size: 0.95rem; font-weight: 500; opacity: 0.8; }
 
                .itinerary-items { list-style: none; display: flex; flex-direction: column; gap: 12px; }
                .itinerary-item { background: rgba(255, 255, 255, 0.03); border-radius: 18px; border: 1px solid var(--border-light); display: flex; align-items: center; padding: 14px 18px; gap: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); backdrop-filter: blur(8px); }
                .itinerary-item:hover { border-color: var(--primary); background: rgba(255, 255, 255, 0.06); box-shadow: var(--shadow-xl); transform: translateX(6px); }
                
                .drag-handle { color: var(--text-tertiary); cursor: grab; padding: 4px; transition: color 0.2s; }
                .drag-handle:hover { color: var(--text-primary); }
                .drag-handle:active { cursor: grabbing; }
 
                .item-index-box { width: 32px; height: 32px; background: rgba(255, 255, 255, 0.05); color: var(--text-primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; border: 1px solid var(--border-light); }
                .item-content { flex: 1; overflow: hidden; }
                .item-content h4 { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.01em; }
                .full-name { font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.8; font-weight: 500; }
 
                .remove-item-btn { color: var(--text-tertiary); padding: 8px; border-radius: 12px; opacity: 0; transition: all 0.2s; }
                .itinerary-item:hover .remove-item-btn { opacity: 1; }
                .remove-item-btn:hover { background: rgba(244, 63, 94, 0.15); color: var(--accent); }
 
                .itinerary-actions { background: rgba(11, 15, 26, 0.8); padding: 24px; border-radius: 28px; display: flex; flex-direction: column; gap: 20px; box-shadow: var(--shadow-xl); border: 1px solid var(--border-glass); backdrop-filter: blur(24px); }
                
                .btn-optimize { background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 18px; border-radius: 18px; font-weight: 800; font-size: 1rem; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .btn-optimize:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4); background: var(--action-hover); }
                .btn-optimize:active { transform: translateY(0); }
                .btn-optimize:disabled { background: var(--text-tertiary); box-shadow: none; pointer-events: none; opacity: 0.4; }
 
                .optimize-hint { font-size: 0.65rem; color: var(--text-tertiary); text-align: center; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-top: -8px; }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

            `}</style>

        </div>
    );
};

export default SpotList;
