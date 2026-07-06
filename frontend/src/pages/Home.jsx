import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiTrendingUp, FiShield, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Home = ({ isDark }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.title')}
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              {t('home.subtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/listings"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('home.viewListings')}
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                {t('home.register')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.whySkladbor')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-primary-100'}`}>
                <FiSearch className="text-primary-600" size={32} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.easySearch')}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('home.easySearchDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className={`rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-primary-100'}`}>
                <FiTrendingUp className="text-primary-600" size={32} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.wideSelection')}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('home.wideSelectionDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className={`rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-primary-100'}`}>
                <FiShield className="text-primary-600" size={32} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.secure')}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('home.secureDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className={`rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-primary-100'}`}>
                <FiClock className="text-primary-600" size={32} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.fast')}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('home.fastDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className={`py-16 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="text-4xl font-bold text-primary-600 mb-4">1</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.step1')}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('home.step1Desc')}
              </p>
            </div>

            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="text-4xl font-bold text-primary-600 mb-4">2</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.step2')}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('home.step2Desc')}
              </p>
            </div>

            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="text-4xl font-bold text-primary-600 mb-4">3</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('home.step3')}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('home.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            {t('home.ctaSubtitle')}
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {t('home.ctaButton')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
