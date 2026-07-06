import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiMapPin, FiX } from 'react-icons/fi';
import { db, storage } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProgressBar from '../../components/Loaders/ProgressBar';
import useAuthStore from '../../store/authStore';

const AddWarehouse = ({ isDark }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      lat: 41.2995,
      lng: 69.2401,
      address: '',
      region: 'Toshkent',
    },
    sizeSqm: '',
    pricePerSqm: '',
    category: 'quruq',
    amenities: [],
    minRentPeriod: 1,
  });
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const amenitiesList = [
    '24_7_xavfsizlik',
    'yuk_mashinasi_kirishi',
    'elektr_quvvati',
    'temir_yol_kirishi',
    'suv',
    'gaz',
    'internet',
  ];

  const categories = [
    { value: 'sovutgichli', label: 'Sovutgichli' },
    { value: 'quruq', label: 'Quruq' },
    { value: 'ochiq_maydon', label: 'Ochiq maydon' },
    { value: 'konteyner', label: 'Konteyner' },
    { value: 'boshqa', label: 'Boshqa' },
  ];

  const regions = [
    'Toshkent',
    'Samarqand',
    'Buxoro',
    'Farg\'ona',
    'Andijon',
    'Namangan',
    'Qashqadaryo',
    'Surxondaryo',
    'Jizzax',
    'Sirdaryo',
    'Xorazm',
    'Navoiy',
    'Qoraqalpog\'iston',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [locationField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const storageRef = ref(storage, `warehouses/${user.uid}/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
      setUploadProgress(((i + 1) / images.length) * 100);
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }

      await addDoc(collection(db, 'warehouses'), {
        ...formData,
        sizeSqm: Number(formData.sizeSqm),
        pricePerSqm: Number(formData.pricePerSqm),
        minRentPeriod: Number(formData.minRentPeriod),
        images: imageUrls,
        ownerId: user.uid,
        status: 'available',
        isPremium: false,
        premiumExpiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      navigate('/dashboard/landlord');
    } catch (err) {
      setError('Ombor qo\'shishda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Yangi ombor qo'shish</h1>

      {error && (
        <div className={`border px-4 py-3 rounded mb-4 ${isDark ? 'bg-red-900/20 border-red-700 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Asosiy ma'lumotlar</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Sarlavha
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                placeholder="Ombor nomi"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Tavsif
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                placeholder="Ombor haqida batafsil ma'lumot"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Joylashuv</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Viloyat
              </label>
              <select
                name="location.region"
                value={formData.location.region}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Manzil
              </label>
              <input
                type="text"
                name="location.address"
                required
                value={formData.location.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                placeholder="To'liq manzil"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kenglik (lat)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  name="location.lat"
                  value={formData.location.lat}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Uzunlik (lng)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  name="location.lng"
                  value={formData.location.lng}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Size and Price */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>O'lcham va narx</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Maydon (m²)
              </label>
              <input
                type="number"
                name="sizeSqm"
                required
                value={formData.sizeSqm}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                placeholder="Maydon"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Narx (so'm/m²/oy)
              </label>
              <input
                type="number"
                name="pricePerSqm"
                required
                value={formData.pricePerSqm}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                placeholder="Narx"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Minimal ijaraga olish (oy)
              </label>
              <input
                type="number"
                name="minRentPeriod"
                value={formData.minRentPeriod}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              />
            </div>
          </div>
        </div>

        {/* Category and Amenities */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Kategoriya va qulayliklar</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Kategoriya
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Qulayliklar
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Rasmlar</h2>
          <div className="mb-4">
            <label className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary-500 ${isDark ? 'border-gray-600 hover:border-primary-400' : 'border-gray-300'}`}>
              <div className="text-center">
                <FiUpload className={`mx-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={32} />
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rasm yuklash</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className="mb-4">
              <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Yuklangan rasmlar:</p>
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Yuklanmoqda...</p>
              <ProgressBar progress={uploadProgress} />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/landlord')}
            className={`flex-1 py-3 rounded-lg transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWarehouse;
