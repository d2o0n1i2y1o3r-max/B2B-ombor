import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'tenant',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Parollar mos kelmaydi');
      return;
    }

    if (formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Firestore'da foydalanuvchi ma'lumotlarini saqlash
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        companyName: formData.companyName,
        subscriptionTier: 'free',
        subscriptionExpiresAt: null,
        createdAt: new Date(),
      });

      setUser({
        uid: user.uid,
        email: user.email,
        name: formData.name,
        role: formData.role,
        subscriptionTier: 'free',
      });

      navigate('/');
    } catch (err) {
      setError('Ro\'yxatdan o\'tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Ro'yxatdan o'tish
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ombor ijarasi marketplace platformasi
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Ism-familiya"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Email manzili"
              />
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Telefon raqam"
              />
            </div>

            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="tenant">Ijarachi (Tenant)</option>
                <option value="landlord">Ombor egasi (Landlord)</option>
              </select>
            </div>

            {formData.role === 'landlord' && (
              <div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Kompaniya nomi (ixtiyoriy)"
                />
              </div>
            )}

            <div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Parol"
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Parolni tasdiqlang"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hisobingiz bormi?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Tizimga kiring
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
