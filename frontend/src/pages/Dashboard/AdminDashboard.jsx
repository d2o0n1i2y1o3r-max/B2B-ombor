import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const AdminDashboard = ({ isDark }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWarehouses: 0,
    pendingWarehouses: 0,
    activeWarehouses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Fetch warehouses
      const warehousesSnapshot = await getDocs(collection(db, 'warehouses'));
      const warehousesData = warehousesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWarehouses(warehousesData);

      // Calculate stats
      setStats({
        totalUsers: usersData.length,
        totalWarehouses: warehousesData.length,
        pendingWarehouses: warehousesData.filter(w => w.status === 'pending').length,
        activeWarehouses: warehousesData.filter(w => w.status === 'available').length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveWarehouse = async (warehouseId) => {
    try {
      const warehouseRef = doc(db, 'warehouses', warehouseId);
      await updateDoc(warehouseRef, { status: 'available' });
      fetchData();
    } catch (error) {
      console.error('Error approving warehouse:', error);
    }
  };

  const rejectWarehouse = async (warehouseId) => {
    try {
      const warehouseRef = doc(db, 'warehouses', warehouseId);
      await updateDoc(warehouseRef, { status: 'rejected' });
      fetchData();
    } catch (error) {
      console.error('Error rejecting warehouse:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Rostdan ham foydalanuvchini o\'chirmoqchimisiz?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Yuklanmoqda...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className={`flex gap-4 mb-6 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'border-b-2 border-primary-600 text-primary-600' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          Statistika
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-primary-600 text-primary-600' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          Foydalanuvchilar
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2 font-medium ${activeTab === 'warehouses' ? 'border-b-2 border-primary-600 text-primary-600' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          Omborlar
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Jami foydalanuvchilar</h3>
            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalUsers}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Jami omborlar</h3>
            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalWarehouses}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Kutilmoqda</h3>
            <p className={`text-3xl font-bold mt-2 text-yellow-600`}>{stats.pendingWarehouses}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Faol</h3>
            <p className={`text-3xl font-bold mt-2 text-green-600`}>{stats.activeWarehouses}</p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
          <table className="min-w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Ism
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Email
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Rol
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Telefon
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className={isDark ? 'bg-gray-800' : 'bg-white'}>
              {users.map((user) => (
                <tr key={user.id} className={isDark ? 'border-gray-700' : 'border-gray-200'}>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user.email}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'landlord' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Warehouses Tab */}
      {activeTab === 'warehouses' && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
          <table className="min-w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Sarlavha
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Egasi
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Holati
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Narx
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className={isDark ? 'bg-gray-800' : 'bg-white'}>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id} className={isDark ? 'border-gray-700' : 'border-gray-200'}>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {warehouse.title}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {warehouse.ownerId}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className={`px-2 py-1 rounded text-xs ${
                      warehouse.status === 'available' ? 'bg-green-100 text-green-800' :
                      warehouse.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {warehouse.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {warehouse.pricePerSqm} so'm/m²
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {warehouse.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveWarehouse(warehouse.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Qabul qilish
                        </button>
                        <button
                          onClick={() => rejectWarehouse(warehouse.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Rad etish
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
