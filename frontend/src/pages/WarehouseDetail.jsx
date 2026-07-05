import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiBox, FiDollarSign, FiPhone, FiMail } from 'react-icons/fi';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BookingModal from '../components/BookingModal';
import Skeleton from '../components/Loaders/Skeleton';
import useAuthStore from '../store/authStore';

const WarehouseDetail = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    fetchWarehouse();
  }, [id]);

  const fetchWarehouse = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'warehouses', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setWarehouse({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching warehouse:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    // Booking logic will be implemented
    console.log('Booking submitted:', bookingData);
    setIsBookingModalOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Ombor topilmadi</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-200 rounded-lg h-96 mb-4 flex items-center justify-center">
            {warehouse.images && warehouse.images.length > 0 ? (
              <img
                src={warehouse.images[0]}
                alt={warehouse.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-500">Rasm yo'q</span>
            )}
          </div>
          {warehouse.images && warehouse.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {warehouse.images.slice(1, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${warehouse.title} ${index + 2}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{warehouse.title}</h1>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-2" />
              <span>{warehouse.location.address}, {warehouse.location.region}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <FiBox className="mr-2" />
              <span>{warehouse.sizeSqm} m²</span>
            </div>

            <div className="flex items-center text-gray-600">
              <FiDollarSign className="mr-2" />
              <span>{warehouse.pricePerSqm.toLocaleString()} so'm/m²/oy</span>
            </div>

            <div className="flex items-center text-gray-600">
              <span className="mr-2">Kategoriya:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {warehouse.category}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <span className="mr-2">Minimal ijaraga olish:</span>
              <span>{warehouse.minRentPeriod} oy</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tavsif</h2>
            <p className="text-gray-700">{warehouse.description}</p>
          </div>

          {warehouse.amenities && warehouse.amenities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Qulayliklar</h2>
              <div className="flex flex-wrap gap-2">
                {warehouse.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isAuthenticated && user?.role === 'tenant' && warehouse.status === 'available' && (
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Ijaraga olish so'rovi yuborish
            </button>
          )}

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Ijaraga olish uchun{' '}
                <a href="/login" className="font-semibold underline">
                  tizimga kiring
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      <BookingModal
        warehouse={warehouse}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default WarehouseDetail;
