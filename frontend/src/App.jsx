import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Listings from './pages/Listings';
import WarehouseDetail from './pages/WarehouseDetail';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import LandlordDashboard from './pages/Dashboard/LandlordDashboard';
import TenantDashboard from './pages/Dashboard/TenantDashboard';
import AddWarehouse from './pages/Dashboard/AddWarehouse';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <Router>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar isDark={isDark} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/listings" element={<Listings isDark={isDark} />} />
          <Route path="/warehouse/:id" element={<WarehouseDetail isDark={isDark} />} />
          <Route path="/about" element={<About isDark={isDark} />} />
          <Route path="/login" element={<Login isDark={isDark} />} />
          <Route path="/register" element={<Register isDark={isDark} />} />
          <Route 
            path="/dashboard/landlord" 
            element={
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <LandlordDashboard isDark={isDark} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/tenant" 
            element={
              <ProtectedRoute allowedRoles={['tenant', 'admin']}>
                <TenantDashboard isDark={isDark} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/add-warehouse" 
            element={
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <AddWarehouse isDark={isDark} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
