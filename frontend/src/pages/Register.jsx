import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, getRecaptchaVerifier, clearRecaptchaVerifier } from '../firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';

const Register = ({ isDark }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [step, setStep] = useState(1); // 1: input info, 2: check email
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone) {
      setError(t('auth.fillAllFields'));
      return;
    }

    setLoading(true);

    try {
      const actionCodeSettings = {
        url: window.location.origin + '/register',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, formData.email, actionCodeSettings);
      
      // Save email for verification
      window.localStorage.setItem('emailForSignIn', formData.email);
      
      setStep(2);
    } catch (err) {
      console.error('Email link yuborishda xatolik:', err);
      setError(t('auth.smsError'));
      clearRecaptchaVerifier();
    } finally {
      setLoading(false);
    }
  };

  // Check if user came from email link on mount
  React.useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      
      if (!email) {
        setError('Email topilmadi. Iltimos, qaytadan ro\'yxatdan o\'ting.');
        return;
      }

      setLoading(true);

      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result) => {
          window.localStorage.removeItem('emailForSignIn');
          const user = result.user;

          // Check if user already exists
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (!userDoc.exists()) {
            // Create new user document
            await setDoc(doc(db, 'users', user.uid), {
              name: formData.name || user.displayName || 'Foydalanuvchi',
              email: user.email,
              phone: formData.phone || '',
              role: 'tenant',
              subscriptionTier: 'free',
              subscriptionExpiresAt: null,
              createdAt: new Date(),
            });
          }

          setUser({
            uid: user.uid,
            email: user.email,
            name: userDoc.exists() ? userDoc.data().name : formData.name || user.displayName,
            role: userDoc.exists() ? userDoc.data().role : 'tenant',
            subscriptionTier: 'free',
          });

          navigate('/');
        })
        .catch((err) => {
          console.error('Email link bilan kirishda xatolik:', err);
          setError('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {step === 1 ? t('auth.registerStep1') : t('auth.registerStep2')}
          </h2>
          <p className={`mt-2 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {step === 1 ? t('auth.registerSubtitle') : t('auth.codeSent', { phone: formData.email })}
          </p>
        </div>

        {error && (
          <div className={`border px-4 py-3 rounded ${isDark ? 'bg-red-900/20 border-red-700 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendLink}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${isDark ? 'bg-gray-800 border-gray-600 placeholder-gray-500 text-white' : 'border-gray-300 placeholder-gray-500 text-gray-900'}`}
                  placeholder={t('auth.name')}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${isDark ? 'bg-gray-800 border-gray-600 placeholder-gray-500 text-white' : 'border-gray-300 placeholder-gray-500 text-gray-900'}`}
                  placeholder={t('auth.email')}
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${isDark ? 'bg-gray-800 border-gray-600 placeholder-gray-500 text-white' : 'border-gray-300 placeholder-gray-500 text-gray-900'}`}
                  placeholder={t('auth.phonePlaceholder')}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? t('auth.loading') : t('auth.sendSms')}
              </button>
            </div>

            <div className="text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  {t('nav.login')}
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-lg mb-4">
                {t('auth.codeSent', { phone: formData.email })}
              </p>
              <p className="text-sm">
                Emailingizni tekshiring va havolani bosing. Keyin sahifa avtomatik ravishda yangilanadi.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError('');
              }}
              className={`w-full py-2 px-4 border rounded-md text-sm font-medium ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {t('auth.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
