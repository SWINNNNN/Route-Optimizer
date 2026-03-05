import React from 'react';
import { useRoute } from '../../context/RouteContext';
import '../common/Input.css';

const FuelSettings = () => {
    const { fuelSettings, updateFuelSettings } = useRoute();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow empty string so user can clear the input
        // Only parse if there's a value, otherwise use a default or empty string
        const val = value === '' ? '' : parseFloat(value);
        updateFuelSettings({ [name]: val });
    };

    return (
        <div className="card fuel-card">
            <h3>Vehicle Settings</h3>
            <div className="settings-grid">
                <div className="input-group">
                    <label>Mileage (km/l)</label>
                    <input
                        type="number"
                        className="input-field"
                        name="mileage"
                        value={fuelSettings.mileage}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>Fuel Price (per liter)</label>
                    <input
                        type="number"
                        className="input-field"
                        name="fuelPrice"
                        value={fuelSettings.fuelPrice}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <style>{`
                .fuel-card {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 32px;
                    border-radius: 28px;
                    margin-top: 24px;
                    border: 1px solid var(--border-glass);
                    backdrop-filter: blur(12px);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                .fuel-card h3 {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 24px;
                    letter-spacing: -0.02em;
                    opacity: 0.9;
                }
                .settings-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .input-group label { 
                    display: block; 
                    margin-bottom: 8px; 
                    font-size: 0.75rem; 
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-tertiary); 
                }
                .input-field {
                    width: 100%;
                    background: rgba(13, 17, 28, 0.8);
                    border: 1px solid var(--border-light);
                    border-radius: 12px;
                    padding: 14px 16px;
                    color: var(--text-primary);
                    font-weight: 700;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                .input-field:focus {
                    border-color: var(--primary);
                    background: rgba(13, 17, 28, 1);
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
            `}</style>
        </div>
    );
};

export default FuelSettings;
