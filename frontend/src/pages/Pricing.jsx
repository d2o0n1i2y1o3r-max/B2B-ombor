import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const Pricing = ({ isDark }) => {
  const plans = [
    {
      name: 'Bepul',
      price: '0',
      period: 'oyiga',
      features: [
        { text: '1 ta ombor e\'loni', included: true },
        { text: 'Qidiruv va filter', included: true },
        { text: 'Asosiy dashboard', included: true },
        { text: 'AI funksiyalari', included: false },
        { text: 'Premium e\'lon', included: false },
        { text: 'Statistika paneli', included: false },
      ],
      buttonText: 'Boshlash',
      popular: false,
    },
    {
      name: 'Standart',
      price: '99,000',
      period: 'oyiga',
      features: [
        { text: '5 tagacha e\'lon', included: true },
        { text: 'Qidiruv va filter', included: true },
        { text: 'To\'liq dashboard', included: true },
        { text: 'AI funksiyalari', included: true },
        { text: 'Premium e\'lon', included: false },
        { text: 'Statistika paneli', included: false },
      ],
      buttonText: 'Tanlash',
      popular: true,
    },
    {
      name: 'Biznes',
      price: '249,000',
      period: 'oyiga',
      features: [
        { text: 'Cheksiz e\'lon', included: true },
        { text: 'Qidiruv va filter', included: true },
        { text: 'To\'liq dashboard', included: true },
        { text: 'AI funksiyalari', included: true },
        { text: 'Premium e\'lon (1 ta bepul)', included: true },
        { text: 'Statistika paneli', included: true },
      ],
      buttonText: 'Tanlash',
      popular: false,
    },
  ];

  const premiumFeatures = [
    {
      title: 'Premium E\'lon',
      price: '50,000',
      period: 'oyiga',
      features: [
        'Qidiruv natijalarida birinchi o\'rinlarda chiqadi',
        '"TOP" belgisi bilan ajralib turadi',
        '3 marta ko\'proq rasm yuklash imkoniyati',
        'Ko\'proq ko\'rish va so\'rov olish',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Tariflar</h1>
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          O'zingizga mos tarifni tanlang va biznesingizni rivojlantiring
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 ${
              plan.popular ? 'border-2 border-primary-500 relative' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Ommabop
                </span>
              </div>
            )}
            
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
            <div className="mb-6">
              <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> so'm/{plan.period}</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  {feature.included ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <FiX className="text-red-500 mr-2" />
                  )}
                  <span className={feature.included ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-500' : 'text-gray-400')}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 rounded-lg font-semibold ${
                plan.popular
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Premium Listing */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-yellow-50 to-orange-50'} rounded-lg p-8 mb-16`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Premium E\'lon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-md`}>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
              <div className="mb-4">
                <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.price}</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> so'm/{feature.period}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <FiCheck className="text-green-500 mr-2 mt-1" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600">
                Premiumga o'tish
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>To'lov usullari</h2>
        <div className="flex justify-center gap-8">
          <div className="flex items-center">
            <div className="w-12 h-8 bg-blue-600 rounded mr-2"></div>
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Click.uz</span>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-8 bg-purple-600 rounded mr-2"></div>
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Payme</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
