import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { Map, LogOut } from 'lucide-react';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header glass fade-in">
            <div className="container header-content">
                <div className="logo-section">
                    <div className="logo-icon-sm">
                        <Map size={18} color="white" />
                    </div>
                    <span className="logo-text">RouteWise</span>
                </div>

                <div className="user-section">
                    <div className="user-info-pill">
                        <span className="user-name">Hello, {user?.name || 'Traveler'}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
