import React, { useState, useEffect } from 'react';
import { useRoute } from '../../context/RouteContext';
import { searchLocation } from '../../utils/geocoding';
import { Search, MapPin, X, Loader2, Navigation, Landmark, Building2, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SpotForm = () => {
    const { addStop } = useRoute();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                try {
                    const data = await searchLocation(query, controller.signal);
                    if (active && data !== null) {
                        setResults(data);
                        setLoading(false);
                    }
                } catch (error) {
                    if (active) setLoading(false);
                }
            } else {
                setResults([]);
                setLoading(false);
            }
        }, 300);

        return () => {
            active = false;
            controller.abort();
            clearTimeout(delayDebounceFn);
        };
    }, [query]);

    const handleSelect = (result) => {
        addStop({
            name: result.shortName,
            fullName: result.name,
            lat: result.lat,
            lng: result.lng
        });
        setQuery('');
        setResults([]);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'city':
            case 'town':
            case 'village':
                return <Building2 size={14} />;
            case 'street':
                return <Navigation size={14} />;
            case 'house':
                return <HomeIcon size={14} />;
            default:
                return <Landmark size={14} />;
        }
    };

    return (
        <div className="spot-form-premium">
            <div className={`search-container ${loading ? 'loading' : ''}`}>
                <div className="search-bar">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Add a destination..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    {loading ? (
                        <Loader2 className="spinner" size={16} />
                    ) : query && (
                        <button className="clear-btn" onClick={() => { setQuery(''); setResults([]); }}>
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.ul
                        className="results-dropdown glass"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {results.slice(0, 8).map((res, i) => (
                            <motion.li
                                key={i}
                                onClick={() => handleSelect(res)}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <div className={`result-icon-box type-${res.type || 'default'}`}>
                                    {getTypeIcon(res.type)}
                                </div>
                                <div className="result-details">
                                    <div className="title-row">
                                        <p className="main-name">{res.shortName}</p>
                                        {res.type && <span className="type-tag">{res.type}</span>}
                                    </div>
                                    <p className="sub-name">{res.name.split(',').slice(1).join(',').trim()}</p>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}

                {query.trim().length >= 2 && !loading && results.length === 0 && (
                    <motion.div
                        className="no-results-box glass"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                    >
                        <MapPin size={24} className="no-res-icon" />
                        <p>No destinations found for "{query}"</p>
                        <span>Try checking for typos or searching for a city nearby.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .spot-form-premium { position: relative; width: 100%; z-index: 1000; margin-bottom: 24px; }
                .search-container { background: rgba(255, 255, 255, 0.05); border-radius: 16px; border: 1px solid var(--border-light); backdrop-filter: blur(12px); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); transition: all 0.3s ease; }
                .search-container:focus-within { border-color: var(--primary); background: rgba(255, 255, 255, 0.08); box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.4), 0 12px 48px rgba(0, 0, 0, 0.5); }
                
                .search-bar { display: flex; align-items: center; padding: 14px 20px; gap: 12px; min-height: 56px; }
                .search-icon { color: var(--primary); opacity: 0.9; }
                .search-input { flex: 1; border: none; outline: none; font-size: 1rem; font-weight: 600; color: var(--text-primary); background: transparent; letter-spacing: -0.01em; }
                .search-input::placeholder { color: var(--text-secondary); opacity: 0.7; }
                .clear-btn { color: var(--text-tertiary); padding: 6px; border-radius: 50%; display: flex; transition: all 0.2s; background: rgba(255, 255, 255, 0.05); }
                .clear-btn:hover { background: rgba(244, 63, 94, 0.15); color: var(--accent); }
                
                .spinner { color: var(--primary); animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .results-dropdown { position: absolute; top: calc(100% + 10px); left: 0; right: 0; background: rgba(22, 27, 46, 0.95); backdrop-filter: blur(24px) saturate(200%); border-radius: 24px; list-style: none; overflow: hidden; border: 1px solid var(--border-glass); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4); padding: 10px 0; }
                .results-dropdown li { padding: 14px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s ease; }
                .results-dropdown li:hover { background: rgba(255, 255, 255, 0.05); transform: translateX(6px); }
                
                .result-icon-box { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
                .results-dropdown li:hover .result-icon-box { transform: scale(1.1); box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); }
                
                .type-city, .type-town { background: rgba(59, 130, 246, 0.15); color: #60A5FA; }
                .type-street { background: rgba(16, 185, 129, 0.15); color: #34D399; }
                .type-house { background: rgba(245, 158, 11, 0.15); color: #FBBF24; }
                .type-default { background: rgba(255, 255, 255, 0.08); color: var(--text-primary); }

                .result-details { overflow: hidden; flex: 1; }
                .title-row { display: flex; align-items: center; gap: 8px; justify-content: space-between; }
                .main-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.01em; }
                .type-tag { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; background: rgba(255, 255, 255, 0.08); padding: 4px 10px; border-radius: 8px; color: var(--text-secondary); letter-spacing: 0.05em; }
                .sub-name { font-size: 0.85rem; color: var(--text-secondary); margin: 4px 0 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.7; font-weight: 500; }

                .no-results-box { position: absolute; top: calc(100% + 10px); left: 0; right: 0; background: rgba(22, 27, 46, 0.95); backdrop-filter: blur(24px) saturate(200%); border-radius: 24px; border: 1px solid var(--border-glass); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4); padding: 40px 30px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
                .no-res-icon { color: var(--text-tertiary); opacity: 0.5; margin-bottom: 8px; }
                .no-results-box p { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; }
                .no-results-box span { font-size: 0.85rem; color: var(--text-secondary); opacity: 0.7; }

            `}</style>

        </div>
    );
};


export default SpotForm;
