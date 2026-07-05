import React, { useState, useEffect } from 'react';
import { FiEye, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Skeleton from '../../components/Loaders/Skeleton';
import useAuthStore from '../../store/authStore';

const TenantDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'bookingRequests'), where('tenantId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'accepted':
        return <FiCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FiXCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda';
      case 'accepted':
        return 'Qabul qilingan';
      case 'rejected':
        return 'Rad etilgan';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Tenant Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Jami so'rovlar</h3>
          <p className="text-3xl font-bold text-primary-600">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Kutilmoqda</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Qabul qilingan</h3>
          <p className="text-3xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'accepted').length}
          </p>
        </div>
      </div>

      {/* Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Mening so'rovlari</h2>
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">Hali so'rovlar yo'q</p>
            <a
              href="/listings"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Omborlarni ko'rish
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{booking.warehouseTitle}</h3>
                    <p className="text-gray-600">{booking.warehouseAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Ijaraga olish muddati</p>
                    <p className="font-semibold">{booking.requestedPeriod} oy</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Yuborilgan sana</p>
                    <p className="font-semibold">
                      {booking.createdAt?.toDate?.()?.toLocaleDateString('uz-UZ') || '-'}
                    </p>
                  </div>
                </div>

                {booking.message && (
                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <p className="text-sm text-gray-600">Xabar:</p>
                    <p className="text-gray-800">{booking.message}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <a
                    href={`/warehouse/${booking.warehouseId}`}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                  >
                    <FiEye />
                    Omborni ko'rish
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
