import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouteProvider } from './context/RouteContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

// Protected Route Component


function App() {
  return (
    <AuthProvider>
      <RouteProvider>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </RouteProvider>
    </AuthProvider>
  );
}

export default App;
