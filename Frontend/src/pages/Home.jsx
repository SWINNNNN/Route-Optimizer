import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRoute } from '../context/RouteContext';
import Header from '../components/layout/Header';
import SpotForm from '../components/dashboard/SpotForm';
import SpotList from '../components/dashboard/SpotList';
import FuelSettings from '../components/dashboard/FuelSettings';
import RouteResult from '../components/dashboard/RouteResult';
import SavedRoutes from '../components/dashboard/SavedRoutes';
import TripDashboard from '../components/dashboard/TripDashboard';
import MapPreview from '../components/dashboard/MapPreview';
import { MapPin, Calendar, Shield, LayoutDashboard, Map as MapIcon, Cloud } from 'lucide-react';
import '../components/common/Button.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { optimizedRoute } = useRoute();
  const [activeTab, setActiveTab] = React.useState('planner'); // 'planner', 'map', or 'dashboard'

  return (
    <div className="home-page">
      {isAuthenticated ? (
        <div className="immersive-experience authenticated-home">
          <Header />

          <div className="immersive-content">
            {/* Background Layer */}
            <div className="app-background-layer">
              {activeTab === 'map' ? (
                <div className="map-background fade-in" key="active-map-view">
                  <MapPreview route={optimizedRoute} isImmersive={true} />
                </div>
              ) : (
                <div className="premium-gradient-bg fade-in">
                  <div className="bg-blob blob-1"></div>
                  <div className="bg-blob blob-2"></div>
                  <div className="bg-blob blob-3"></div>
                </div>
              )}
            </div>

            {/* Overlays */}
            <main className="overlay-container container">
              {/* Specialized View Switcher */}
              <div className="view-switcher-row">
                <div className="view-switcher glass">
                  <button
                    className={`nav-tab ${activeTab === 'planner' ? 'active' : ''}`}
                    onClick={() => setActiveTab('planner')}
                  >
                    <LayoutDashboard size={18} />
                    <span>Planner</span>
                  </button>
                  <button
                    className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`}
                    onClick={() => setActiveTab('map')}
                  >
                    <MapIcon size={18} />
                    <span>Go to Map</span>
                  </button>
                  <button
                    className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <Calendar size={18} />
                    <span>Insights</span>
                  </button>
                </div>
              </div>

              {activeTab === 'planner' && (
                <div className="planner-overlay fade-in">
                  <aside className="tool-panel left-tool-panel glass">
                    <SpotForm />
                    <SavedRoutes />
                    <FuelSettings />
                  </aside>

                  <div className="tool-panel right-tool-panel glass">
                    {optimizedRoute.length > 0 ? <RouteResult /> : <SpotList />}
                  </div>

                  {/* Spacer for symmetry in centering */}
                  <div className="planner-spacer" />
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="dashboard-overlay glass fade-in">
                  <TripDashboard setActiveTab={setActiveTab} />
                </div>
              )}

              {/* Map Mode has no overlay content, allowing the map background to be fully visible and interactive */}
            </main>
          </div>
        </div>
      ) : (
        // ... rest of anonymous home (stays same)
        <div className="landing-experience anonymous-home">


          <section className="hero-compact container slide-up">
            <div className="hero-content">
              {/* ... branding block ... */}
              <div className="hero-brand-block-center">
                <div className="brand-logo-container">
                  <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="cafe-racer-emblem">
                    {/* The iconic Face of the GT 650 */}
                    <circle cx="38" cy="18" r="5" stroke="currentColor" strokeWidth="2" />
                    <circle cx="62" cy="18" r="5" stroke="currentColor" strokeWidth="2" />
                    <circle cx="50" cy="35" r="14" stroke="currentColor" strokeWidth="3" />
                    <circle cx="50" cy="35" r="10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    <path d="M44 35 L56 35 M50 29 L50 41" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    <path d="M40 22 L20 18 L15 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M60 22 L80 18 L85 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="22" cy="35" r="3" fill="currentColor" opacity="0.6" />
                    <circle cx="78" cy="35" r="3" fill="currentColor" opacity="0.6" />
                  </svg>
                </div>
                <h2 className="brand-name-hero">RouteWise</h2>
              </div>
              <h1 className="hero-title">
                Plan the perfect <span className="gradient-text">road trip.</span>
              </h1>
              <p className="hero-subtitle">
                Intelligent Travel Planning for Tourists. Complete itineraries in seconds.
              </p>

              <div className="hero-actions">
                <div className="hero-primary-cta">
                  <Link to="/register" className="btn btn-hero-xl">Get Started</Link>
                  <Link to="/login" className="btn-hero-login-subtle">Already have an account? Log In</Link>
                </div>
                <div className="social-proof">
                  <span><Shield size={16} /> Secure</span>
                  <span><Calendar size={16} /> Flexible</span>
                </div>
              </div>
            </div>

            <div className="feature-quick-grid">
              <div className="feature-mini-card glass">
                <div className="icon-box blue"><MapIcon size={20} /></div>
                <div>
                  <h5>Smart Routes</h5>
                  <p>Auto-optimized paths</p>
                </div>
              </div>
              <div className="feature-mini-card glass">
                <div className="icon-box green"><Cloud size={20} /></div>
                <div>
                  <h5>Live Weather</h5>
                  <p>Real-time conditions</p>
                </div>
              </div>
              <div className="feature-mini-card glass">
                <div className="icon-box purple"><MapPin size={20} /></div>
                <div>
                  <h5>Curated Stays</h5>
                  <p>Best local hotels</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <style>{`
                .home-page { min-height: 100vh; background-color: var(--bg-secondary); color: var(--text-primary); }
                
                /* Authenticated Immersive Layout */
                .immersive-experience { position: relative; height: 100vh; overflow: hidden; display: flex; flex-direction: column; background: var(--bg-secondary); }
                .immersive-content { flex: 1; position: relative; display: flex; flex-direction: column; overflow: hidden; }
                
                .app-background-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; overflow: hidden; pointer-events: none; }
                .map-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: auto; }
                .premium-gradient-bg { 
                   width: 100%; 
                   height: 100%; 
                   background: var(--bg-mesh); 
                   position: relative; 
                   opacity: 0.8;
                }
                
                .bg-blob {
                  position: absolute;
                  border-radius: 50%;
                  filter: blur(100px);
                  opacity: 0.15;
                  z-index: 0;
                  animation: float 25s infinite alternate;
                }
                .blob-1 { width: 700px; height: 700px; background: rgba(59, 130, 246, 0.2); top: -150px; right: -150px; }
                .blob-2 { width: 600px; height: 600px; background: rgba(244, 63, 94, 0.15); bottom: -150px; left: -150px; animation-delay: -7s; }
                .blob-3 { width: 450px; height: 450px; background: rgba(139, 92, 246, 0.12); top: 35%; left: 25%; animation-delay: -12s; }

                @keyframes float {
                  0% { transform: translate(0, 0) scale(1); }
                  100% { transform: translate(60px, 40px) scale(1.05); }
                }
                
                .overlay-container { position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; padding: 24px 48px; pointer-events: none; transition: all 0.4s ease; }
                .overlay-container > * { pointer-events: auto; }

                .view-switcher-row { display: flex; justify-content: center; align-items: center; margin-bottom: 32px; z-index: 100; }
                .view-switcher { 
                  display: flex; 
                  gap: 4px; 
                  padding: 8px; 
                  border-radius: 24px; 
                  box-shadow: var(--shadow-xl); 
                  border: 1px solid var(--border-glass); 
                  background: rgba(13, 17, 28, 0.8); 
                  backdrop-filter: blur(24px) saturate(200%); 
                }
                
                .nav-tab { 
                  display: flex; 
                  align-items: center; 
                  gap: 10px; 
                  padding: 12px 24px; 
                  border-radius: 16px; 
                  font-weight: 700; 
                  color: var(--text-secondary); 
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                  white-space: nowrap; 
                  font-size: 0.85rem; 
                  letter-spacing: -0.01em; 
                }
                .nav-tab.active { 
                  background: var(--brand-gradient); 
                  color: white; 
                  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3); 
                  transform: scale(1.02); 
                  filter: brightness(1.1);
                }
                .nav-tab:hover:not(.active) { background: rgba(255,255,255,0.05); color: var(--text-primary); }

                /* Center-Focused Layout */
                .planner-overlay { 
                  display: grid; 
                  grid-template-columns: 320px 540px 320px; 
                  gap: 32px; 
                  height: calc(100% - 100px); 
                  justify-content: center; 
                  align-items: start;
                  width: 100%;
                  max-width: 1512px;
                  margin: 0 auto;
                }
                
                .left-tool-panel { grid-column: 1; }
                .right-tool-panel { 
                  grid-column: 2;
                  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
                  z-index: 20;
                }
                .planner-spacer { grid-column: 3; }

                .tool-panel { 
                  border-radius: 32px; 
                  padding: 32px; 
                  max-height: calc(100vh - 200px); 
                  overflow-y: auto; 
                  scrollbar-width: none; 
                  border: 1px solid var(--border-glass);
                  background: var(--bg-glass);
                  backdrop-filter: blur(24px) saturate(200%);
                }
                .tool-panel::-webkit-scrollbar { display: none; }
                
                .dashboard-overlay { 
                  width: 100%; 
                  max-width: 1100px; 
                  margin: 0 auto; 
                  padding: 48px; 
                  border-radius: 32px; 
                  background: rgba(13, 17, 28, 0.9); 
                  overflow-y: auto; 
                  max-height: calc(100% - 100px); 
                  backdrop-filter: blur(32px) saturate(200%); 
                  border: 1px solid var(--border-glass);
                  box-shadow: 0 50px 100px rgba(0,0,0,0.5);
                }

                /* Landing Experience */
                .landing-experience { 
                  background: var(--bg-mesh);
                  height: 100vh; 
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  position: relative;
                }

                .landing-experience::before {
                  content: '';
                  position: absolute;
                  inset: 0;
                  background-image: 
                    radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
                  background-size: 40px 40px;
                  opacity: 0.5;
                }



                .btn-hero-xl {
                  background: var(--brand-gradient); 
                  color: white !important; 
                  padding: 20px 64px; 
                  font-size: 1.15rem;
                  border-radius: 18px; 
                  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
                  font-weight: 800;
                  letter-spacing: -0.01em;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-hero-xl:hover {
                  transform: translateY(-4px) scale(1.02);
                  box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
                  filter: brightness(1.15);
                }

                .hero-compact { text-align: center; max-width: 1000px; padding-top: 80px; position: relative; z-index: 1; }
                
                .hero-brand-block-center { margin-bottom: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
                .brand-logo-container { color: var(--action); padding: 10px; background: rgba(59, 130, 246, 0.1); border-radius: 20px; box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
                .brand-name-hero { font-size: 0.9rem; font-weight: 800; letter-spacing: 0.4em; text-transform: uppercase; color: var(--text-tertiary); margin-top: 4px; }
  
                .hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.04em; color: var(--text-primary); margin-bottom: 16px; }
                .hero-subtitle { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 32px; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.5; font-weight: 500; }
                .gradient-text { 
                  background: var(--brand-gradient-text); 
                  -webkit-background-clip: text; 
                  -webkit-text-fill-color: transparent; 
                }
                
                .hero-actions { display: flex; flex-direction: column; align-items: center; gap: 32px; }
                .hero-primary-cta { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  
                .btn-hero-login-subtle {
                  font-size: 0.95rem;
                  font-weight: 700;
                  color: var(--text-secondary) !important;
                  transition: all 0.2s;
                  opacity: 0.9;
                }
                .btn-hero-login-subtle:hover {
                  opacity: 1;
                  color: var(--text-primary) !important;
                }
  
                .social-proof { 
                  display: flex; gap: 32px; align-items: center; justify-content: center;
                  font-size: 0.9rem; color: var(--text-tertiary); font-weight: 600; margin-top: 16px;
                }
                .social-proof span { display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
                .social-proof span svg { color: var(--primary); opacity: 0.8; }
                .social-proof span:hover { color: var(--text-primary); transform: translateY(-1px); }
  
                .feature-quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; width: 100%; max-width: 1000px; margin-left: auto; margin-right: auto; }
                .feature-mini-card { 
                  padding: 24px; 
                  border-radius: 24px; 
                  display: flex; 
                  align-items: center; 
                  gap: 24px; 
                  border: 1px solid var(--border-light); 
                  background: rgba(255, 255, 255, 0.03); 
                  backdrop-filter: blur(12px);
                  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                
                .feature-mini-card:hover {
                  transform: translateY(-8px) scale(1.02);
                  background: rgba(255, 255, 255, 0.06);
                  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
                  border-color: var(--primary);
                }

                .feature-mini-card h5 { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; transition: color 0.3s ease; }
                .feature-mini-card:hover h5 { color: var(--primary); }
                .feature-mini-card p { font-size: 0.95rem; color: var(--text-secondary); margin: 0; font-weight: 600; }

                
                .icon-box { 
                  width: 52px; 
                  height: 52px; 
                  border-radius: 16px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  color: white; 
                  flex-shrink: 0; 
                }
                
                .icon-box.blue { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); }
                .icon-box.green { background: linear-gradient(135deg, #10B981 0%, #065F46 100%); }
                .icon-box.purple { background: linear-gradient(135deg, #F43F5E 0%, #9F1239 100%); }

                /* Specific Micro-animations */
                .feature-mini-card:hover .icon-box.blue svg { animation: jiggle 0.5s ease-in-out infinite alternate; }
                .feature-mini-card:hover .icon-box.green svg { animation: float-icon 2s ease-in-out infinite; }
                .feature-mini-card:hover .icon-box.purple svg { animation: bounce-pin 0.8s ease-in-out infinite; }

                @keyframes jiggle { 0% { transform: rotate(-5deg); } 100% { transform: rotate(5deg); } }
                @keyframes float-icon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
                @keyframes bounce-pin { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px) scaleY(1.1); } }

                @media (max-width: 1200px) { .planner-overlay { grid-template-columns: 1fr 1fr; } .planner-spacer { display: none; } }
                @media (max-width: 1024px) {
                    .hero-title { font-size: 3.2rem; }
                    .feature-quick-grid { grid-template-columns: 1fr; max-width: 450px; gap: 16px; }
                    .landing-experience { height: auto; padding: 140px 0 80px; overflow: auto; }
                    .planner-overlay { display: flex; flex-direction: column; align-items: center; padding-bottom: 40px; }
                    .left-tool-panel, .right-tool-panel { width: 100%; max-width: 500px; }
                }
            `}</style>
    </div>
  );
};

export default Home;
