import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon, FiGlobe, FiChevronDown } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Navbar = ({ isDark, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsLangOpen(false);
  };

  const languages = [
    { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

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

            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} p-2 rounded-md flex items-center gap-1`}
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm">{currentLang.code.toUpperCase()}</span>
                <FiChevronDown size={16} />
              </button>

              {isLangOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${i18n.language === lang.code ? (isDark ? 'bg-gray-700 text-primary-400' : 'bg-gray-100 text-primary-600') : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
            <div className="relative mr-2">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'} p-2 flex items-center gap-1`}
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm">{currentLang.code.toUpperCase()}</span>
                <FiChevronDown size={16} />
              </button>

              {isLangOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${i18n.language === lang.code ? (isDark ? 'bg-gray-700 text-primary-400' : 'bg-gray-100 text-primary-600') : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
