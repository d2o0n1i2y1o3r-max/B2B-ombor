import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Listings from './pages/Listings';
import WarehouseDetail from './pages/WarehouseDetail';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import LandlordDashboard from './pages/Dashboard/LandlordDashboard';
import TenantDashboard from './pages/Dashboard/TenantDashboard';
import AddWarehouse from './pages/Dashboard/AddWarehouse';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/warehouse/:id" element={<WarehouseDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard/landlord" 
            element={
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <LandlordDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/tenant" 
            element={
              <ProtectedRoute allowedRoles={['tenant', 'admin']}>
                <TenantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/add-warehouse" 
            element={
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <AddWarehouse />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
