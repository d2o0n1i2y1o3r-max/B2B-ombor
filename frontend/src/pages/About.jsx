import React from 'react';

const About = ({ isDark }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
        <h1 className={`text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Biz haqimizda
        </h1>
        
        <div className="space-y-6">
          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Kompaniyamiz
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              SkladBor - O'zbekistondagi ombor ijarasi uchun eng yirik va ishonchli onlayn platforma.
              Biz ombor egalarini biznes egalari bilan bog'lab, ular uchun qulay va samarali hamkorlik yaratamiz.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bizning vazifamiz
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Bizning vazifamiz - ombor ijarasi jarayonini soddalashtirish va shaffof qilish.
              Bizning platformamiz orqali siz o'zingizga mos omborni osongina topishingiz,
              ombor egasi sifatida esa o'z omboringizni keng auditoriyaga taklif qilishingiz mumkin.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Nima uchun biz?
            </h2>
            <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>Keng omborlar katalogi - turli viloyatlardagi omborlar</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>Qulay qidiruv tizimi - filtr va xarita orqali qidirish</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>Shaffof narxlar - bepul va arzon narxlarda</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>Ishonchli hamkorlar - verified ombor egalar</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>24/7 qo'llab-quvvatlash - har doim yordam beramiz</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Biz bilan bog'lanish
            </h2>
            <div className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>Email:</strong> info@skladbor.uz</p>
              <p><strong>Telefon:</strong> +998 90 123 45 67</p>
              <p><strong>Manzil:</strong> Toshkent sh., Amir Temur ko'chasi, 1</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
