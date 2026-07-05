import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">SkladBor</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
              Bosh sahifa
            </Link>
            <Link to="/listings" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
              Omborlar
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
              Narxlar
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant'}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  <FiLogOut />
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-700 hover:text-primary-600 px-3 py-2">
              Bosh sahifa
            </Link>
            <Link to="/listings" className="block text-gray-700 hover:text-primary-600 px-3 py-2">
              Omborlar
            </Link>
            <Link to="/pricing" className="block text-gray-700 hover:text-primary-600 px-3 py-2">
              Narxlar
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant'}
                  className="block text-gray-700 hover:text-primary-600 px-3 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-primary-600 px-3 py-2"
                >
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-primary-600 px-3 py-2">
                  Kirish
                </Link>
                <Link to="/register" className="block text-gray-700 hover:text-primary-600 px-3 py-2">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
