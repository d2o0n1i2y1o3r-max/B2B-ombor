import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import WarehouseCard from '../../components/WarehouseCard';
import Skeleton from '../../components/Loaders/Skeleton';
import useAuthStore from '../../store/authStore';

const LandlordDashboard = ({ isDark }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchWarehouses();
    fetchBookings();
  }, [user]);

  const fetchWarehouses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'warehouses'), where('ownerId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const warehousesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'bookingRequests'), where('landlordId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      try {
        await deleteDoc(doc(db, 'warehouses', id));
        setWarehouses(warehouses.filter(w => w.id !== id));
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    // Booking status update logic
    console.log('Update booking status:', bookingId, status);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Landlord Dashboard</h1>
        <Link
          to="/dashboard/add-warehouse"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus />
          Yangi ombor qo'shish
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Jami omborlar</h3>
          <p className="text-3xl font-bold text-primary-600">{warehouses.length}</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Kutilmoqda so'rovlar</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Qabul qilingan</h3>
          <p className="text-3xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'accepted').length}
          </p>
        </div>
      </div>

      {/* Warehouses */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Mening omborlarim</h2>
        {warehouses.length === 0 ? (
          <div className={`text-center py-12 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Hali ombor qo'shilmagan</p>
            <Link
              to="/dashboard/add-warehouse"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Birinchi omborni qo'shing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="relative">
                <WarehouseCard warehouse={warehouse} isDark={isDark} />
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/dashboard/edit-warehouse/${warehouse.id}`}
                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-1"
                  >
                    <FiEdit />
                    Tahrirlash
                  </Link>
                  <button
                    onClick={() => handleDelete(warehouse.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center gap-1"
                  >
                    <FiTrash2 />
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookings */}
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>So'rovlar</h2>
        {bookings.length === 0 ? (
          <div className={`text-center py-12 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Hali so'rovlar yo'q</p>
          </div>
        ) : (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <table className="min-w-full">
              <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Ombor
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Ijarachi
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Muddat
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : ''}`}>
                      {booking.warehouseTitle}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : ''}`}>
                      {booking.tenantName}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : ''}`}>
                      {booking.requestedPeriod} oy
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookingStatus(booking.id, 'accepted')}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Qabul qilish
                          </button>
                          <button
                            onClick={() => handleBookingStatus(booking.id, 'rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Rad etish
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
