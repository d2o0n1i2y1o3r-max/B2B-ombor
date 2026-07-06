import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon, FiGlobe } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Navbar = ({ isDark, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    const languages = ['uz', 'ru', 'en'];
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  const getNextLanguageName = () => {
    const languages = ['uz', 'ru', 'en'];
    const names = { uz: 'Русский', ru: 'English', en: 'O\'zbek' };
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    return names[languages[nextIndex]];
  };

  return (
    <nav className={`sticky top-0 z-50 shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo isDark={isDark} showText={true} size="md" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2 rounded-md`}>
              {t('nav.home')}
            </Link>
            <Link to="/listings" className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2 rounded-md`}>
              {t('nav.listings')}
            </Link>
            <Link to="/about" className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2 rounded-md`}>
              {t('nav.about')}
            </Link>

            <button
              onClick={toggleLanguage}
              className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} p-2 rounded-md`}
              title={getNextLanguageName()}
            >
              <FiGlobe size={20} />
              <span className="ml-1 text-sm">{i18n.language.toUpperCase()}</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} p-2 rounded-md`}
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant'}
                  className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2 rounded-md`}
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2 rounded-md`}
                >
                  <FiLogOut />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2 rounded-md`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleLanguage}
              className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} p-2 mr-2`}
              title={getNextLanguageName()}
            >
              <FiGlobe size={20} />
              <span className="ml-1 text-sm">{i18n.language.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} p-2 mr-2`}
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} p-2`}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className={`block ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2`}>
              {t('nav.home')}
            </Link>
            <Link to="/listings" className={`block ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2`}>
              {t('nav.listings')}
            </Link>
            <Link to="/about" className={`block ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2`}>
              {t('nav.about')}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant'}
                  className={`block ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2`}
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2`}
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`block ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2`}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className={`block ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} px-3 py-2`}>
                  {t('nav.register')}
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
