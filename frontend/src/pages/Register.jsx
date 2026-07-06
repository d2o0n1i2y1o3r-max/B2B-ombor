import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, getRecaptchaVerifier, clearRecaptchaVerifier } from '../firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';

const Register = ({ isDark }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1: input info, 2: verify code
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPhoneNumber = (phone) => {
    // Format phone to +998XXXXXXXXX format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('998')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+998' + cleaned.slice(1);
    }
    return '+998' + cleaned;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone) {
      setError(t('auth.fillAllFields'));
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(formData.phone);
      const verifier = getRecaptchaVerifier('recaptcha-container');
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(result);
      setStep(2);
    } catch (err) {
      console.error('SMS yuborishda xatolik:', err);
      setError(t('auth.smsError'));
      clearRecaptchaVerifier();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      setError(t('auth.enterCode'));
      return;
    }

    setLoading(true);

    try {
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;

      // Firestore'da foydalanuvchi ma'lumotlarini saqlash
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formatPhoneNumber(formData.phone),
        role: 'tenant',
        subscriptionTier: 'free',
        subscriptionExpiresAt: null,
        createdAt: new Date(),
      });

      setUser({
        uid: user.uid,
        email: user.email || formData.email,
        name: formData.name,
        role: 'tenant',
        subscriptionTier: 'free',
      });

      navigate('/');
    } catch (err) {
      console.error('Kod tasdiqlashda xatolik:', err);
      setError(t('auth.codeError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {step === 1 ? t('auth.registerStep1') : t('auth.registerStep2')}
          </h2>
          <p className={`mt-2 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {step === 1 ? t('auth.registerSubtitle') : t('auth.codeSent', { phone: formatPhoneNumber(formData.phone) })}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={step === 1 ? handleSendCode : handleVerifyCode}>
          {error && (
            <div className={`border px-4 py-3 rounded ${isDark ? 'bg-red-900/20 border-red-700 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`}>
              {error}
            </div>
          )}

          {step === 1 ? (
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
          ) : (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center text-2xl tracking-widest ${isDark ? 'bg-gray-800 border-gray-600 placeholder-gray-500 text-white' : 'border-gray-300 placeholder-gray-500 text-gray-900'}`}
                  placeholder="XXXXXX"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? t('auth.loading') : step === 1 ? t('auth.sendSms') : t('auth.verifyCode')}
            </button>
          </div>

          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setVerificationCode('');
                setError('');
              }}
              className={`w-full py-2 px-4 border rounded-md text-sm font-medium ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {t('auth.back')}
            </button>
          )}

          <div className="text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                {t('nav.login')}
              </Link>
            </p>
          </div>
        </form>
        
        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Register;
